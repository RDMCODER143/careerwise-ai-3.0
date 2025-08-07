import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, ArrowRight, Brain, Target, Users } from "lucide-react";
import heroImage from "@/assets/hero-ai-resume.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-subtle overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-secondary/10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Brain className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium text-primary">AI-Powered Career Platform</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                AI-Powered Career
              </span>
              <br />
              <span className="text-foreground">Guidance & Job Matching</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Smart resume screening and personalized career counseling for students, 
              plus AI-driven talent matching for employers. Transform your career journey with intelligent insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-hero hover:opacity-90 shadow-elegant group text-lg px-8 py-6"
                asChild
              >
                <a href="/auth?role=job_seeker">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  I'm Looking for a Job
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-secondary text-secondary hover:bg-gradient-success hover:text-secondary-foreground shadow-card group text-lg px-8 py-6"
                asChild
              >
                <a href="/auth?role=employer">
                  <Building2 className="w-5 h-5 mr-2" />
                  I'm Hiring Talent
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span>95% Match Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-secondary" />
                <span>50K+ Users Trust Us</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="AI Resume Analysis" 
                className="w-full max-w-lg mx-auto rounded-2xl shadow-elegant animate-glow-pulse"
              />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-hero rounded-2xl flex items-center justify-center animate-bounce-gentle">
                <Brain className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;