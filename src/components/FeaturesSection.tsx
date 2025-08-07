import { Brain, Target, Users, Briefcase, TrendingUp, MessageSquare, Zap, Shield } from "lucide-react";
import jobMatchingImage from "@/assets/job-matching-3d.jpg";

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <div 
      className="group p-6 bg-card rounded-2xl shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Resume Analysis",
      description: "Get instant feedback on your resume with our advanced AI that identifies strengths, weaknesses, and optimization opportunities.",
      delay: 0
    },
    {
      icon: Target,
      title: "Personalized Career Paths",
      description: "Discover tailored career recommendations based on your skills, interests, and market demand for optimal career growth.",
      delay: 100
    },
    {
      icon: Zap,
      title: "Smart Job Matching",
      description: "Our AI matches you with the perfect job opportunities that align with your skills, experience, and career goals.",
      delay: 200
    },
    {
      icon: Briefcase,
      title: "Employer Dashboard",
      description: "Post jobs and let our AI screen candidates automatically, presenting you with the most qualified applicants first.",
      delay: 300
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Detection",
      description: "Identify missing skills for your dream job and get personalized learning recommendations to bridge the gap.",
      delay: 400
    },
    {
      icon: MessageSquare,
      title: "Interview Practice",
      description: "Practice with AI-powered mock interviews tailored to your industry and receive detailed feedback to improve.",
      delay: 500
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full mb-6">
            <Shield className="w-4 h-4 text-accent mr-2" />
            <span className="text-sm font-medium text-accent">Core Features</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need for
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">Career Success</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From AI-powered resume analysis to intelligent job matching, CareerWise provides 
            comprehensive tools for both job seekers and employers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
          
          <div className="relative">
            <div className="relative">
              <img 
                src={jobMatchingImage} 
                alt="Job Matching Process" 
                className="w-full rounded-2xl shadow-elegant"
              />
              <div className="absolute inset-0 bg-gradient-card rounded-2xl"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-gradient-success p-4 rounded-2xl shadow-elegant">
              <Users className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div className="absolute -top-6 -right-6 bg-gradient-hero p-4 rounded-2xl shadow-elegant animate-bounce-gentle">
              <Target className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;