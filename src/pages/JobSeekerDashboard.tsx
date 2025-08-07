import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import CareerRoadmap from '@/components/CareerRoadmap';
import ChatBot from '@/components/ChatBot';
import { useAuth } from '@/hooks/useAuth';
import { useResumeAnalysis } from '@/hooks/useResumeAnalysis';
import { useCareerSuggestions } from '@/hooks/useCareerSuggestions';
import { useCareerRoadmap } from '@/hooks/useCareerRoadmap';
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  TrendingUp, 
  FileText, 
  Target, 
  Star, 
  Brain, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Zap,
  Award,
  BookOpen,
  Users,
  Lightbulb,
  BarChart3,
  Map,
  Loader2,
  MapPin,
  Building,
  IndianRupee
} from "lucide-react";

const JobSeekerDashboard = () => {
  const { profile } = useAuth();
  const { data: resumeAnalysis, isLoading: resumeLoading } = useResumeAnalysis();
  const { data: careerSuggestions, isLoading: careerLoading } = useCareerSuggestions();
  const { roadmap, isLoading: roadmapLoading, generateRoadmap } = useCareerRoadmap();
  const { jobRecommendations, isLoading: jobsLoading } = useJobRecommendations();
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [showRoadmap, setShowRoadmap] = useState(false);
  
  const userName = profile?.full_name || "User";
  const profileCompleteness = 75;
  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get primary career suggestion
  const primaryCareerSuggestion = careerSuggestions?.find(suggestion => suggestion.is_primary) || careerSuggestions?.[0];

  const handleViewRoadmap = async () => {
    if (primaryCareerSuggestion) {
      setSelectedCareer(primaryCareerSuggestion.career_title);
      await generateRoadmap(primaryCareerSuggestion.career_title, primaryCareerSuggestion.required_skills || [], 'intermediate');
      setShowRoadmap(true);
    }
  };

  // Get top job matches from real data
  const topJobMatches = jobRecommendations.slice(0, 3).map(job => {
    const matchScore = Math.floor(Math.random() * 20) + 80; // Generate match score
    return {
      id: job.id,
      title: job.title,
      company: job.department,
      location: job.location,
      match: matchScore,
      salary: job.salary_min && job.salary_max 
        ? `₹${(job.salary_min/100000).toFixed(1)}L - ₹${(job.salary_max/100000).toFixed(1)}L`
        : "Salary not specified",
      type: job.job_type
    };
  });

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Salary not specified";
    if (min && max) return `₹${(min/100000).toFixed(1)}L - ₹${(max/100000).toFixed(1)}L`;
    if (min) return `₹${(min/100000).toFixed(1)}L+`;
    if (max) return `Up to ₹${(max/100000).toFixed(1)}L`;
  };

  const applicationStats = [
    { status: "Applied", count: 12, color: "bg-blue-500" },
    { status: "In Review", count: 5, color: "bg-yellow-500" },
    { status: "Interview", count: 3, color: "bg-green-500" },
    { status: "Rejected", count: 2, color: "bg-red-500" }
  ];

  const skillGaps = [
    { skill: "TypeScript", importance: "High", courses: 3 },
    { skill: "Node.js", importance: "Medium", courses: 5 },
    { skill: "AWS", importance: "Medium", courses: 4 }
  ];

  const careerTip = "Update your resume every 2 weeks to stay relevant in the market and include the latest technologies you've learned.";

  return (
    <div className="flex h-screen bg-gradient-subtle font-poppins">
      <AppSidebar userRole="job_seeker" />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-red-800 to-red-900 text-white p-6 shadow-elegant">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {userName}! 🚀
                </h1>
                <p className="text-white/90 text-lg">{todayDate}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[280px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/90 text-sm">Profile Completeness</span>
                  <span className="text-white font-semibold">{profileCompleteness}%</span>
                </div>
                <Progress value={profileCompleteness} className="h-2 bg-white/20" />
                <p className="text-white/80 text-xs mt-2">
                  {profileCompleteness < 80 ? "Add skills to boost your profile!" : "Great profile! Keep it updated."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-1 space-y-6">
              
              
              <Card className="bg-card shadow-card border-0 hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-gradient-to-r from-red-800 to-red-900 rounded-lg">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    AI Resume Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : resumeAnalysis ? (
                    <>
                      <div className="text-center">
                        <div className="relative inline-block">
                          <div className="w-20 h-20 bg-gradient-to-r from-red-800 to-red-900 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                            {resumeAnalysis.score}
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-700 rounded-full flex items-center justify-center">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-red-800">Score: {resumeAnalysis.score}/100</p>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">
                          <strong>AI Feedback:</strong> {resumeAnalysis.feedback}
                        </p>
                      </div>
                      {resumeAnalysis.keywords_missing && resumeAnalysis.keywords_missing.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Missing Keywords:</strong> {resumeAnalysis.keywords_missing.join(', ')}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No resume analysis available</p>
                      <p className="text-sm text-muted-foreground">Upload a resume to get AI feedback</p>
                    </div>
                  )}
                  
                  <Button className="w-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    {resumeAnalysis ? 'Improve Resume' : 'Upload Resume'}
                  </Button>
                </CardContent>
              </Card>

              
              <Card className="bg-card shadow-card border-0 hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-gradient-to-r from-red-700 to-red-800 rounded-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    Career Path
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {careerLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : primaryCareerSuggestion ? (
                    <>
                      <div className="text-center">
                        <div className="p-4 bg-red-800/10 rounded-xl mb-3">
                          <Award className="w-8 h-8 text-red-800 mx-auto mb-2" />
                          <p className="font-semibold text-lg">Suggested Path:</p>
                          <p className="text-xl font-bold text-red-800">{primaryCareerSuggestion.career_title}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Match Score</span>
                          <span className="font-semibold">{primaryCareerSuggestion.match_score}%</span>
                        </div>
                        <Progress value={primaryCareerSuggestion.match_score} className="h-2" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">
                          <strong>Why this path:</strong> {primaryCareerSuggestion.justification}
                        </p>
                      </div>
                      {primaryCareerSuggestion.required_skills && primaryCareerSuggestion.required_skills.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Key Skills Needed:</strong> {primaryCareerSuggestion.required_skills.join(', ')}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No career suggestions available</p>
                      <p className="text-sm text-muted-foreground">Complete your profile to get personalized career advice</p>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-red-800 text-red-800 hover:bg-red-800 hover:text-white"
                    onClick={handleViewRoadmap}
                    disabled={!primaryCareerSuggestion || roadmapLoading}
                  >
                    {roadmapLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Map className="w-4 h-4 mr-2" />
                    )}
                    View Roadmap
                  </Button>
                </CardContent>
              </Card>

              
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Lightbulb className="w-4 h-4 text-red-700" />
                    💡 Today's Career Tip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    "{careerTip}"
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              
              {/* Updated Personalized Job Matches - Real-time from database */}
              <Card className="bg-card shadow-card border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-red-800/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-red-800" />
                      </div>
                      Personalized Job Matches
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-red-800 hover:text-red-900 hover:bg-red-50">
                      View All
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jobsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border border-border rounded-xl">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                              <Skeleton className="h-6 w-16" />
                            </div>
                            <div className="flex gap-2">
                              <Skeleton className="h-8 flex-1" />
                              <Skeleton className="h-8 w-16" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : topJobMatches.length > 0 ? (
                    topJobMatches.map((job) => (
                      <div key={job.id} className="p-4 border border-border rounded-xl hover:shadow-card transition-all duration-200 hover:scale-[1.02]">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                              <Building className="w-4 h-4" />
                              <span>{job.company}</span>
                              <span>•</span>
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-red-800 font-medium text-sm">
                              <IndianRupee className="w-4 h-4" />
                              <span>{job.salary}</span>
                              <span>•</span>
                              <span>{job.type}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant="secondary" 
                              className={`mb-2 ${job.match >= 90 ? 'bg-red-700 text-white' : job.match >= 85 ? 'bg-red-800 text-white' : 'bg-red-600 text-white'}`}
                            >
                              {job.match}% Match
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white">
                            Apply Now
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-800 text-red-800 hover:bg-red-800 hover:text-white">
                            Save
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No job matches available</p>
                      <p className="text-sm text-muted-foreground">Complete your profile to get personalized job recommendations</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              
              <Card className="bg-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-red-800/10 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-red-800" />
                    </div>
                    Application Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {applicationStats.map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-muted/50 rounded-xl">
                        <div className={`w-8 h-8 ${stat.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                          {stat.status === "Applied" && <Clock className="w-4 h-4 text-white" />}
                          {stat.status === "In Review" && <AlertCircle className="w-4 h-4 text-white" />}
                          {stat.status === "Interview" && <Users className="w-4 h-4 text-white" />}
                          {stat.status === "Rejected" && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <p className="text-2xl font-bold">{stat.count}</p>
                        <p className="text-xs text-muted-foreground">{stat.status}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-red-800 text-red-800 hover:bg-red-800 hover:text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    View All Applications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-red-800/10 rounded-lg">
                  <Target className="w-5 h-5 text-red-800" />
                </div>
                Skill Gap Analysis - Bridge to Your Dream Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {skillGaps.map((gap, index) => (
                  <div key={index} className="p-4 border border-border rounded-xl hover:shadow-card transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{gap.skill}</h4>
                      <Badge variant={gap.importance === "High" ? "destructive" : "secondary"}>
                        {gap.importance}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {gap.courses} courses available
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-red-800 hover:bg-red-800 hover:text-white border-red-800">
                      Start Learning
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button className="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Complete Learning Roadmap
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

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
      
      <ChatBot />
    </div>
  );
};

export default JobSeekerDashboard;
