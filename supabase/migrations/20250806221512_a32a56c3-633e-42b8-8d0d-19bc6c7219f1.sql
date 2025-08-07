
-- Add additional columns to the profiles table for complete profile information
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_company TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expected_salary TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS degree TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS major TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS graduation_year TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Enable realtime for profiles table
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
