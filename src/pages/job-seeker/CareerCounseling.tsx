import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import CareerRoadmap from '@/components/CareerRoadmap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target, 
  Award, 
  BookOpen, 
  TrendingUp,
  Users,
  Lightbulb,
  Calendar,
  ArrowRight,
  CheckCircle,
  Loader2,
  Map,
  Zap
} from "lucide-react";
import { useCareerSuggestions } from '@/hooks/useCareerSuggestions';
import { useCareerRoadmap } from '@/hooks/useCareerRoadmap';

const CareerCounseling: React.FC = () => {
  const { data: careerSuggestions = [], isLoading, error } = useCareerSuggestions();
  const { roadmap, isLoading: roadmapLoading, generateRoadmap } = useCareerRoadmap();
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [showRoadmap, setShowRoadmap] = useState(false);

  const nextSteps = [
    { step: "Complete Skills Assessment", completed: true },
    { step: "Upload Updated Resume", completed: true },
    { step: "Take Career Personality Test", completed: false },
    { step: "Schedule 1-on-1 Counseling", completed: false },
    { step: "Create Learning Roadmap", completed: false }
  ];

  const completedSteps = nextSteps.filter(step => step.completed).length;
  const progressValue = (completedSteps / nextSteps.length) * 100;

  const handleGenerateRoadmap = async (careerTitle: string) => {
    setSelectedCareer(careerTitle);
    await generateRoadmap(careerTitle, [], 'intermediate');
    setShowRoadmap(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-subtle font-poppins">
        <AppSidebar userRole="job_seeker" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-subtle font-poppins">
      <AppSidebar userRole="job_seeker" />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-gradient-hero text-white p-6 shadow-elegant">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Career Counseling</h1>
            <p className="text-white/90 text-lg">
              Personalized guidance to help you navigate your career path
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Career Match Results */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                Recommended Career Paths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {careerSuggestions.length > 0 ? (
                careerSuggestions.map((suggestion, index) => (
                  <div key={suggestion.id} className="p-4 border border-border rounded-xl hover:shadow-card transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{suggestion.career_title}</h3>
                          <Badge variant={suggestion.match_score >= 90 ? "default" : suggestion.match_score >= 80 ? "secondary" : "outline"}>
                            {suggestion.match_score}% Match
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{suggestion.justification}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {suggestion.required_skills?.map((skill, skillIndex) => (
                            <Badge key={skillIndex} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-4 text-sm">
                          {suggestion.growth_rate && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span>Growth: {suggestion.growth_rate}</span>
                            </div>
                          )}
                          {suggestion.salary_range && (
                            <div className="flex items-center gap-1">
                              <span>💰 {suggestion.salary_range}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-hero hover:opacity-90"
                        onClick={() => handleGenerateRoadmap(suggestion.career_title)}
                        disabled={roadmapLoading}
                      >
                        {roadmapLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Map className="w-4 h-4 mr-2" />
                        )}
                        Generate Roadmap
                      </Button>
                      <Button variant="outline">
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Career Suggestions Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete your profile and upload your resume to get personalized career recommendations.
                  </p>
                  <Button className="bg-gradient-hero hover:opacity-90">
                    Complete Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Next Steps */}
            <Card className="bg-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  Your Career Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{completedSteps}/{nextSteps.length} Complete</span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.completed ? "bg-green-500" : "bg-muted"
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className={step.completed ? "line-through text-muted-foreground" : ""}>
                      {step.step}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Schedule Counseling */}
            <Card className="bg-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  1-on-1 Counseling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-card rounded-xl">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Expert Guidance</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Connect with career counselors who specialize in your field of interest
                  </p>
                  <Button className="w-full bg-gradient-hero hover:opacity-90">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Session
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">What You'll Get:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Personalized career strategy
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Goal setting and action plan
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Interview preparation tips
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Roadmap Dialog */}
        <Dialog open={showRoadmap} onOpenChange={setShowRoadmap}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Career Learning Roadmap
              </DialogTitle>
            </DialogHeader>
            {roadmap && (
              <CareerRoadmap roadmap={roadmap} careerTitle={selectedCareer} />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default CareerCounseling;
