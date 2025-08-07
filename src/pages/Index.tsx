import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import StatsSection from "@/components/StatsSection";
import CareerQuizSection from "@/components/CareerQuizSection";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === "admin" || profile.app_role === "admin") {
        navigate("/admin", { replace: true });
      } else if (profile.role === "job_seeker") {
        navigate("/job-seeker-dashboard", { replace: true });
      } else if (profile.role === "employer") {
        navigate("/employer-dashboard", { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render the landing page if user is authenticated
  if (user && profile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <StatsSection />
        <CareerQuizSection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
