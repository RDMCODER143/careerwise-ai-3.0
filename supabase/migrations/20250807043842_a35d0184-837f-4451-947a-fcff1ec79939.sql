
-- Add missing columns to profiles table for admin functionality
ALTER TABLE public.profiles 
ADD COLUMN app_role text,
ADD COLUMN is_banned boolean DEFAULT false,
ADD COLUMN banned_at timestamp with time zone,
ADD COLUMN banned_reason text;

-- Create a simple function to toggle user ban status
CREATE OR REPLACE FUNCTION public.toggle_user_ban(
  target_user_id uuid,
  ban_reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is currently banned
  IF EXISTS (SELECT 1 FROM profiles WHERE user_id = target_user_id AND is_banned = true) THEN
    -- Unban the user
    UPDATE profiles 
    SET 
      is_banned = false,
      banned_at = NULL,
      banned_reason = NULL,
      updated_at = NOW()
    WHERE user_id = target_user_id;
  ELSE
    -- Ban the user
    UPDATE profiles 
    SET 
      is_banned = true,
      banned_at = NOW(),
      banned_reason = COALESCE(ban_reason, 'No reason provided'),
      updated_at = NOW()
    WHERE user_id = target_user_id;
  END IF;
END;
$$;
