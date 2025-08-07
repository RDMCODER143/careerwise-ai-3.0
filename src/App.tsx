import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import ResumeAnalyzer from "./pages/job-seeker/ResumeAnalyzer";
import CareerCounseling from "./pages/job-seeker/CareerCounseling";
import JobRecommendations from "./pages/job-seeker/JobRecommendations";
import SkillGapAnalyzer from "./pages/job-seeker/SkillGapAnalyzer";
import MockInterviews from "./pages/job-seeker/MockInterviews";
import MyApplications from "./pages/job-seeker/MyApplications";
import ProfileSettings from "./pages/job-seeker/ProfileSettings";
import JobPostings from "./pages/employer/JobPostings";
import Candidates from "./pages/employer/Candidates";
import Analytics from "./pages/employer/Analytics";
import Notifications from "./pages/employer/Notifications";
import Settings from "./pages/employer/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/job-seeker-dashboard" 
              element={
                <ProtectedRoute requiredRole="job_seeker">
                  <JobSeekerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resume-analyzer" 
              element={
                <ProtectedRoute requiredRole="job_seeker">
                  <ResumeAnalyzer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/career-counseling" 
              element={
                <ProtectedRoute requiredRole="job_seeker">
                  <CareerCounseling />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/job-recommendations" 
              element={
                <ProtectedRoute requiredRole="job_seeker">
                  <JobRecommendations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/skill-gap" 
              element={
                <ProtectedRoute requiredRole="job_seeker">
                  <SkillGapAnalyzer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mock-interviews" 
              element={
                <ProtectedRoute requiredRole="job_seeker">
                  <MockInterviews />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-applications" 
              element={
                <ProtectedRoute requiredRole="job_seeker">
                  <MyApplications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile-settings" 
              element={
                <ProtectedRoute requiredRole="job_seeker">
                  <ProfileSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employer-dashboard" 
              element={
                <ProtectedRoute requiredRole="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/job-postings" 
              element={
                <ProtectedRoute requiredRole="employer">
                  <JobPostings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidates" 
              element={
                <ProtectedRoute requiredRole="employer">
                  <Candidates />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute requiredRole="employer">
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute requiredRole="employer">
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute requiredRole="employer">
                  <Settings />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
