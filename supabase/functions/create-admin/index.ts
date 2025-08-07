
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Starting admin user creation process...');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if admin user already exists
    console.log('Checking for existing admin user...');
    const { data: existingUsers, error: checkError } = await supabaseClient.auth.admin.listUsers();
    
    if (checkError) {
      console.error('Error checking existing users:', checkError);
      throw new Error(`Failed to check existing users: ${checkError.message}`);
    }

    const adminExists = existingUsers.users.find(user => user.email === 'admin@gmail.com');
    
    if (adminExists) {
      console.log('Admin user already exists, checking profile...');
      
      // Check if profile exists
      const { data: existingProfile, error: profileCheckError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('user_id', adminExists.id)
        .maybeSingle();

      if (profileCheckError) {
        console.error('Error checking existing profile:', profileCheckError);
      }

      if (!existingProfile) {
        console.log('Creating profile for existing admin user...');
        // Create profile for existing admin user
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .upsert({
            user_id: adminExists.id,
            full_name: 'System Admin',
            role: 'admin',
            app_role: 'admin'
          });

        if (profileError) {
          console.error('Error creating profile for existing admin:', profileError);
          throw new Error(`Failed to create admin profile: ${profileError.message}`);
        }
        console.log('Profile created successfully for existing admin');
      } else {
        console.log('Admin profile already exists');
        // Update existing profile to ensure it has admin role
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({
            role: 'admin',
            app_role: 'admin'
          })
          .eq('user_id', adminExists.id);

        if (updateError) {
          console.error('Error updating existing profile:', updateError);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Admin user already exists and profile is set up',
          user_id: adminExists.id 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    console.log('Creating new admin user...');
    // Create the admin user
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email: 'admin@gmail.com',
      password: 'Pass@123',
      email_confirm: true,
      user_metadata: {
        full_name: 'System Admin',
        role: 'admin'
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(`Failed to create admin user: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Failed to create admin user: No user data returned');
    }

    console.log('Admin user created in auth, user ID:', authData.user.id);
    console.log('Creating admin profile...');

    // Create the admin profile
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .upsert({
        user_id: authData.user.id,
        full_name: 'System Admin',
        role: 'admin',
        app_role: 'admin'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error(`Failed to create admin profile: ${profileError.message}`);
    }

    console.log('Admin profile created successfully:', profileData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user and profile created successfully',
        user_id: authData.user.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Detailed error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
