
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "job_seeker" | "employer";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to auth page
        navigate("/auth", { replace: true });
        return;
      }

      if (requiredRole && profile?.role !== requiredRole) {
        // Wrong role, redirect to appropriate dashboard
        if (profile?.role === "job_seeker") {
          navigate("/job-seeker-dashboard", { replace: true });
        } else if (profile?.role === "employer") {
          navigate("/employer-dashboard", { replace: true });
        } else {
          navigate("/auth", { replace: true });
        }
      }
    }
  }, [user, profile, loading, navigate, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || (requiredRole && profile?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
