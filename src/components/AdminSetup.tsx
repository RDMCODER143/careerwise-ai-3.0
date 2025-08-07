
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSetup() {
  const [isCreating, setIsCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const createAdmin = async () => {
    setIsCreating(true);
    setError("");
    
    try {
      console.log('Calling create-admin function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('create-admin', {
        body: {},
      });
      
      if (functionError) {
        console.error('Function error:', functionError);
        throw functionError;
      }
      
      console.log('Admin creation result:', data);
      
      if (data && data.success) {
        setSuccess(true);
        console.log('Admin user created successfully with ID:', data.user_id);
      } else {
        setError(data?.error || 'Failed to create admin user');
      }
    } catch (err) {
      console.error('Error creating admin:', err);
      setError(err instanceof Error ? err.message : 'Failed to create admin user. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto border-green-200">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-green-900">Admin Created Successfully!</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium mb-2">Admin Credentials:</p>
            <p className="text-sm text-green-600">
              <strong>Email:</strong> admin@gmail.com<br />
              <strong>Password:</strong> Pass@123
            </p>
          </div>
          
          <p className="text-sm text-green-600">
            The admin user has been created in both the authentication system and profile database. You can now use these credentials to access the admin dashboard.
          </p>
          
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-red-200">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-red-900">Setup Admin Account</CardTitle>
          <p className="text-red-700 mt-2">Create the initial admin user</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium mb-2">Admin credentials that will be created:</p>
          <p className="text-sm text-red-600">
            <strong>Email:</strong> admin@gmail.com<br />
            <strong>Password:</strong> Pass@123
          </p>
        </div>
        
        <Button
          onClick={createAdmin}
          disabled={isCreating}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Admin...
            </>
          ) : (
            "Create Admin User"
          )}
        </Button>
        
        <p className="text-sm text-red-600 text-center">
          This will create the admin user in both the authentication system and profile database
        </p>
      </CardContent>
    </Card>
  );
}
