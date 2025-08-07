
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff } from "lucide-react";
import AdminSetup from "@/components/AdminSetup";
import AdminTestPanel from "@/components/AdminTestPanel";

export default function AdminAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const { signIn, user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && (profile?.role === 'admin' || profile?.app_role === 'admin')) {
      navigate("/admin", { replace: true });
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Invalid login credentials. If this is your first time, please set up the admin account first.");
        } else {
          setError(signInError.message);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AdminSetup />
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setShowSetup(false)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex gap-6">
        {/* Login Form */}
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-red-900">Admin Login</CardTitle>
              <p className="text-red-700 mt-2">Access the admin dashboard</p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-red-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  className="border-red-200 focus:border-red-400 focus:ring-red-400"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-red-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="border-red-200 focus:border-red-400 focus:ring-red-400 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-red-600">
                Only authorized administrators can access this area
              </p>
              
              <div className="border-t border-red-200 pt-4 space-y-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSetup(true)}
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                >
                  First Time? Set Up Admin Account
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setShowTestPanel(!showTestPanel)}
                  className="w-full text-red-600 hover:bg-red-50 text-sm"
                >
                  {showTestPanel ? "Hide" : "Show"} Debug Panel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Panel */}
        {showTestPanel && (
          <div className="w-full max-w-md">
            <AdminTestPanel />
          </div>
        )}
      </div>
    </div>
  );
}
