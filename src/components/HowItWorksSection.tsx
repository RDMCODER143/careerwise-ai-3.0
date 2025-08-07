import { User, Upload, Brain, Target, ArrowRight } from "lucide-react";
import careerGrowthImage from "@/assets/career-growth.jpg";

const StepCard = ({ step, icon: Icon, title, description, isLast = false }) => {
  return (
    <div className="flex flex-col items-center text-center relative">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center shadow-elegant group-hover:scale-110 transition-transform">
          <Icon className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm">
          {step}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed max-w-sm">{description}</p>
      
      {!isLast && (
        <div className="hidden lg:block absolute top-10 left-full w-24 border-t-2 border-dashed border-muted-foreground/30">
          <ArrowRight className="absolute -top-3 -right-3 w-6 h-6 text-muted-foreground/50" />
        </div>
      )}
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      icon: User,
      title: "Create Your Profile",
      description: "Sign up and create a comprehensive profile with your personal information, career preferences, and goals."
    },
    {
      step: 2,
      icon: Upload,
      title: "Upload Resume",
      description: "Upload your resume and let our AI analyze it for strengths, weaknesses, and optimization opportunities."
    },
    {
      step: 3,
      icon: Brain,
      title: "Get AI Insights",
      description: "Receive personalized career suggestions, skill gap analysis, and tailored learning recommendations."
    },
    {
      step: 4,
      icon: Target,
      title: "Apply for Jobs",
      description: "Browse AI-matched job opportunities and apply with confidence using your optimized profile."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            How <span className="bg-gradient-hero bg-clip-text text-transparent">CareerWise</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started in minutes with our simple 4-step process designed to accelerate your career journey
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {steps.map((step, index) => (
            <StepCard 
              key={index} 
              {...step} 
              isLast={index === steps.length - 1} 
            />
          ))}
        </div>

        <div className="relative max-w-2xl mx-auto">
          <img 
            src={careerGrowthImage} 
            alt="Career Growth Journey" 
            className="w-full rounded-2xl shadow-elegant"
          />
          <div className="absolute inset-0 bg-gradient-card rounded-2xl flex items-center justify-center">
            <div className="text-center text-card-foreground">
              <Brain className="w-16 h-16 mx-auto mb-4 animate-bounce-gentle" />
              <h3 className="text-2xl font-bold mb-2">AI-Powered Growth</h3>
              <p className="text-lg opacity-90">Your personalized career journey starts here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;