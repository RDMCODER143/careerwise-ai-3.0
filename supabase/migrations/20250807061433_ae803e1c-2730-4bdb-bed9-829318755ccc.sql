
-- Insert admin profile with the specific UID provided
INSERT INTO public.profiles (user_id, full_name, role, app_role)
VALUES (
    '3dfbde18-7354-43e9-8388-1b15fab11926'::uuid,
    'System Admin',
    'admin',
    'admin'
)
ON CONFLICT (user_id) 
DO UPDATE SET 
    role = 'admin',
    app_role = 'admin',
    full_name = 'System Admin',
    updated_at = NOW();
