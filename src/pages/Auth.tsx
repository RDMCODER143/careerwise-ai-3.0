
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RoleSelector } from "@/components/RoleSelector";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

type UserRole = "job_seeker" | "employer";

export default function Auth() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Pre-select role from URL params if provided
  useEffect(() => {
    const roleParam = searchParams.get("role") as UserRole;
    if (roleParam === "job_seeker" || roleParam === "employer") {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleAuthSuccess = () => {
    navigate("/", { replace: true });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="hidden sm:block h-6 w-px bg-border" />
            <h1 className="hidden sm:block text-lg font-semibold font-poppins">Get Started</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleBackToHome}
            className="flex items-center gap-2 font-poppins"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Illustration & Role Selection */}
          <div className="flex flex-col space-y-8">
            {/* Hero Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
                <div className="text-center space-y-6">
                  <div className="relative mx-auto w-32 h-32">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full animate-pulse"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      {selectedRole === "job_seeker" ? (
                        <GraduationCap className="w-16 h-16 text-white" />
                      ) : selectedRole === "employer" ? (
                        <Briefcase className="w-16 h-16 text-white" />
                      ) : (
                        <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground font-poppins">
                      {selectedRole ? "Welcome Back!" : "Join CareerWise"}
                    </h2>
                    <p className="text-muted-foreground font-poppins">
                      {selectedRole === "job_seeker" 
                        ? "Sign in to your Job Seeker account" 
                        : selectedRole === "employer"
                        ? "Sign in to your Employer account"
                        : "Choose your role to get started"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <RoleSelector
              selectedRole={selectedRole}
              onRoleSelect={handleRoleSelect}
            />
            
            {/* Features List */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="font-semibold mb-4 font-poppins text-lg">Why Choose CareerWise?</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="font-poppins">AI-powered resume analysis and job matching</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="font-poppins">Personalized career guidance and skill recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="font-poppins">Smart candidate screening for employers</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="font-poppins">Interview practice and preparation tools</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <AuthForm
                selectedRole={selectedRole}
                onSuccess={handleAuthSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
