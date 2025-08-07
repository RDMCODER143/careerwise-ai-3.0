import { FileText, Briefcase, Building, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const StatCard = ({ icon: Icon, value, label, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const targetValue = parseInt(value.replace(/[^\d]/g, ''));

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = targetValue / 50;
      const counter = setInterval(() => {
        setCount(prev => {
          if (prev >= targetValue) {
            clearInterval(counter);
            return targetValue;
          }
          return Math.ceil(prev + increment);
        });
      }, 30);
      
      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [targetValue, delay]);

  const formatCount = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="text-center p-6 bg-card rounded-2xl shadow-card hover:shadow-elegant transition-all duration-300 group">
      <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-8 h-8 text-primary-foreground" />
      </div>
      <div className="text-3xl font-bold text-foreground mb-2">
        {formatCount(count)}+
      </div>
      <div className="text-muted-foreground font-medium">{label}</div>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Trusted by <span className="bg-gradient-hero bg-clip-text text-transparent">Thousands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the growing community of professionals who've found success through CareerWise
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            icon={FileText}
            value="125000"
            label="Resumes Analyzed"
            delay={0}
          />
          <StatCard
            icon={Briefcase}
            value="45000"
            label="Jobs Posted"
            delay={200}
          />
          <StatCard
            icon={Building}
            value="2500"
            label="Companies Registered"
            delay={400}
          />
          <StatCard
            icon={TrendingUp}
            value="89"
            label="Success Rate %"
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;