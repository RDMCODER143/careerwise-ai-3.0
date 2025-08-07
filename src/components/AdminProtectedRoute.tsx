
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminAuth from "@/pages/AdminAuth";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) {
      // If user is not admin, redirect to appropriate dashboard
      if (profile.role !== "admin" && profile.app_role !== "admin") {
        if (profile.role === "job_seeker") {
          navigate("/job-seeker-dashboard", { replace: true });
        } else if (profile.role === "employer") {
          navigate("/employer-dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Show admin login if not authenticated
  if (!user) {
    return <AdminAuth />;
  }

  // Show admin login if not admin
  if (profile?.role !== "admin" && profile?.app_role !== "admin") {
    return <AdminAuth />;
  }

  return <>{children}</>;
}
