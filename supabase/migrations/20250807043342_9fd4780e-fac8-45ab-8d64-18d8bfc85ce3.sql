
-- Create admin role enum and update existing app_role if it exists
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('job_seeker', 'employer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add role column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS app_role public.app_role DEFAULT 'job_seeker';

-- Create admin user function
CREATE OR REPLACE FUNCTION public.create_admin_user(
  admin_email TEXT,
  admin_password TEXT
) RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert into auth.users (this is a simplified approach)
  -- In production, you'd typically create the user through Supabase Auth
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
  ) RETURNING id INTO new_user_id;
  
  -- Create admin profile
  INSERT INTO public.profiles (
    user_id,
    full_name,
    role,
    app_role
  ) VALUES (
    new_user_id,
    'System Admin',
    'admin',
    'admin'
  );
  
  RETURN 'Admin user created successfully';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Error creating admin user: ' || SQLERRM;
END;
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = is_admin.user_id 
    AND (profiles.app_role = 'admin' OR profiles.role = 'admin')
  );
$$;

-- Add banned status to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS banned_reason TEXT;

-- Create RLS policies for admin access
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (public.is_admin());

CREATE POLICY "Admins can update user ban status" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (public.is_admin());

-- Create admin users view
CREATE OR REPLACE VIEW public.admin_users_view AS
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.role,
  p.app_role,
  p.company_name,
  p.city,
  p.country,
  p.phone,
  p.is_banned,
  p.banned_at,
  p.banned_reason,
  p.created_at,
  p.updated_at,
  au.email,
  au.created_at as auth_created_at,
  au.last_sign_in_at
FROM public.profiles p
LEFT JOIN auth.users au ON p.user_id = au.id;

-- Grant access to admin view
GRANT SELECT ON public.admin_users_view TO authenticated;

-- Create RLS policy for admin view
CREATE POLICY "Admins can view admin_users_view" 
ON public.admin_users_view FOR SELECT 
TO authenticated 
USING (public.is_admin());

-- Function to ban/unban users
CREATE OR REPLACE FUNCTION public.toggle_user_ban(
  target_user_id UUID,
  ban_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_ban_status BOOLEAN;
BEGIN
  -- Check if current user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Get current ban status
  SELECT is_banned INTO current_ban_status 
  FROM public.profiles 
  WHERE user_id = target_user_id;
  
  -- Toggle ban status
  UPDATE public.profiles 
  SET 
    is_banned = NOT current_ban_status,
    banned_at = CASE WHEN NOT current_ban_status THEN NOW() ELSE NULL END,
    banned_reason = CASE WHEN NOT current_ban_status THEN ban_reason ELSE NULL END,
    updated_at = NOW()
  WHERE user_id = target_user_id;
  
  RETURN NOT current_ban_status;
END;
$$;
