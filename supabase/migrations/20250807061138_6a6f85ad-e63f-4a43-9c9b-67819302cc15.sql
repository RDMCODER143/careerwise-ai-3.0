
-- First, let's check if admin profile exists and create/update it
-- This will handle both cases - if profile exists or doesn't exist
INSERT INTO public.profiles (user_id, full_name, role, app_role)
SELECT 
    au.id,
    'System Admin',
    'admin',
    'admin'
FROM auth.users au
WHERE au.email = 'admin@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
    role = 'admin',
    app_role = 'admin',
    full_name = 'System Admin',
    updated_at = NOW();

-- Also ensure the role constraint allows 'admin' if it doesn't already
-- This will add admin to the check constraint if it's not already there
DO $$
BEGIN
    -- Check if admin role is already allowed in the constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'profiles_role_check' 
        AND check_clause LIKE '%admin%'
    ) THEN
        -- Drop the existing constraint and recreate with admin
        ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
            CHECK (role = ANY (ARRAY['job_seeker'::text, 'employer'::text, 'admin'::text]));
    END IF;
END $$;

-- Also ensure app_role constraint allows 'admin' if it doesn't already
DO $$
BEGIN
    -- Check if admin app_role is already allowed
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'profiles_app_role_check' 
        AND check_clause LIKE '%admin%'
    ) THEN
        -- Drop the existing constraint and recreate with admin
        ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_app_role_check;
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_app_role_check 
            CHECK (app_role = ANY (ARRAY['job_seeker'::text, 'employer'::text, 'admin'::text]));
    END IF;
END $$;
