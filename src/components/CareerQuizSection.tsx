import { Button } from "@/components/ui/button";
import { Brain, Clock, Target, Sparkles, ArrowRight } from "lucide-react";

const CareerQuizSection = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl shadow-elegant p-8 lg:p-12 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-hero opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-success opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-accent mr-2" />
                  <span className="text-sm font-medium text-accent">Free Career Assessment</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Not Sure What Career <br />
                  <span className="bg-gradient-hero bg-clip-text text-transparent">Suits You?</span>
                </h2>
                
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Take our AI-powered career assessment and discover personalized career paths 
                  that match your skills, interests, and personality in just 2 minutes.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">2 Minutes</h3>
                  <p className="text-sm text-muted-foreground">Quick & easy assessment</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">Advanced personality analysis</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Personalized</h3>
                  <p className="text-sm text-muted-foreground">Tailored career recommendations</p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-hero hover:opacity-90 shadow-elegant group text-lg px-8 py-6"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Take Free Career Quiz
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  ✨ Completely free • No email required • Instant results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerQuizSection;