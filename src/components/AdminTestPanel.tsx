
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, User, CheckCircle } from "lucide-react";

export default function AdminTestPanel() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user || !profile) {
    return (
      <Card className="w-full max-w-md border-red-200">
        <CardHeader>
          <CardTitle className="text-red-900 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Status Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">Not authenticated</p>
        </CardContent>
      </Card>
    );
  }

  const isAdmin = profile.role === 'admin' || profile.app_role === 'admin';

  return (
    <Card className="w-full max-w-md border-red-200">
      <CardHeader>
        <CardTitle className="text-red-900 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Status Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">User ID:</span>
          <span className="text-xs font-mono bg-red-50 px-2 py-1 rounded">
            {user.id}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-red-700">Name:</span>
          <span className="text-sm">{profile.full_name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-red-700">Role:</span>
          <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
            {profile.role}
          </Badge>
        </div>
        
        {profile.app_role && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-700">App Role:</span>
            <Badge variant={profile.app_role === 'admin' ? 'default' : 'secondary'}>
              {profile.app_role}
            </Badge>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-red-700">Admin Access:</span>
          {isAdmin ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Granted</span>
            </div>
          ) : (
            <Badge variant="destructive">Denied</Badge>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <p className="text-xs text-red-600">
            Admin credentials: admin@gmail.com / Pass@123
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
