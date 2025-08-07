
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import MockInterviewInterface from '@/components/MockInterviewInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  Video, 
  PlayCircle, 
  Clock,
  Star,
  Award,
  TrendingUp,
  Calendar,
  Users,
  Brain,
  Target,
  CheckCircle
} from "lucide-react";

const MockInterviews: React.FC = () => {
  const [selectedInterviewType, setSelectedInterviewType] = useState<'technical' | 'behavioral' | 'system_design' | null>(null);

  const interviewTypes = [
    {
      type: "technical" as const,
      title: "Technical Interview",
      description: "Practice coding problems and technical concepts",
      duration: "45-60 min",
      difficulty: "Intermediate",
      questions: 15,
      icon: Brain,
      color: "bg-blue-500"
    },
    {
      type: "behavioral" as const,
      title: "Behavioral Interview",
      description: "Work on storytelling and soft skills",
      duration: "30-45 min",
      difficulty: "Beginner",
      questions: 12,
      icon: Users,
      color: "bg-green-500"
    },
    {
      type: "system_design" as const,
      title: "System Design",
      description: "Practice designing large-scale systems",
      duration: "60-90 min",
      difficulty: "Advanced",
      questions: 8,
      icon: Target,
      color: "bg-purple-500"
    }
  ];

  const recentSessions = [
    {
      date: "Yesterday",
      type: "Technical Interview",
      score: 85,
      feedback: "Strong problem-solving skills, work on time complexity analysis",
      duration: "52 min"
    },
    {
      date: "3 days ago",
      type: "Behavioral Interview",
      score: 78,
      feedback: "Good examples, practice the STAR method more",
      duration: "38 min"
    },
    {
      date: "1 week ago",
      type: "Technical Interview",
      score: 72,
      feedback: "Solid approach, focus on edge cases",
      duration: "45 min"
    }
  ];

  const upcomingInterviews = [
    {
      company: "TechCorp",
      position: "Senior Frontend Developer",
      date: "Tomorrow",
      time: "2:00 PM",
      type: "Technical + Behavioral"
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      date: "Friday",
      time: "10:00 AM",
      type: "System Design"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  if (selectedInterviewType) {
    return (
      <div className="flex h-screen bg-gradient-subtle font-poppins">
        <AppSidebar userRole="job_seeker" />
        
        <main className="flex-1 overflow-auto">
          <div className="bg-gradient-hero text-white p-6 shadow-elegant">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">Mock Interview Session</h1>
              <p className="text-white/90 text-lg">
                AI-powered {selectedInterviewType.replace('_', ' ')} interview practice
              </p>
            </div>
          </div>

          <MockInterviewInterface 
            type={selectedInterviewType} 
            onBack={() => setSelectedInterviewType(null)}
          />
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
            <h1 className="text-3xl font-bold mb-2">Mock Interviews</h1>
            <p className="text-white/90 text-lg">
              Practice with AI-powered interviews and get real-time feedback
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card shadow-card border-0">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">78</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </CardContent>
            </Card>
            <Card className="bg-card shadow-card border-0">
              <CardContent className="p-4 text-center">
                <PlayCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
            <Card className="bg-card shadow-card border-0">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">+15</p>
                <p className="text-sm text-muted-foreground">Points This Week</p>
              </CardContent>
            </Card>
            <Card className="bg-card shadow-card border-0">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">8.5</p>
                <p className="text-sm text-muted-foreground">Hours Practiced</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interview Types */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-primary" />
                    Start New Interview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {interviewTypes.map((interview, index) => (
                    <div key={index} className="p-4 border border-border rounded-xl hover:shadow-card transition-shadow">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${interview.color}`}>
                          <interview.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{interview.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{interview.description}</p>
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {interview.duration}
                            </div>
                            <Badge variant="outline">{interview.difficulty}</Badge>
                            <span>{interview.questions} questions</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-gradient-hero hover:opacity-90"
                          onClick={() => setSelectedInterviewType(interview.type)}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Interview
                        </Button>
                        <Button variant="outline">
                          <Video className="w-4 h-4 mr-2" />
                          Practice
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Sessions */}
              <Card className="bg-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Recent Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{session.type}</h4>
                          <p className="text-sm text-muted-foreground">{session.date} • {session.duration}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(session.score)}`}>
                            {session.score}
                          </div>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{session.feedback}</p>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Start */}
              <Card className="bg-gradient-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Mic className="w-4 h-4" />
                    Quick Practice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-hero hover:opacity-90"
                    onClick={() => setSelectedInterviewType('behavioral')}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Interview
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedInterviewType('technical')}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video Interview
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedInterviewType('system_design')}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Quick Questions
                  </Button>
                </CardContent>
              </Card>

              {/* Progress Tracking */}
              <Card className="bg-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4" />
                    Weekly Goal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Interview Practice</span>
                      <span>3/5 sessions</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      2 more sessions to reach your weekly goal!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Real Interviews */}
              <Card className="bg-card shadow-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    Upcoming Interviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingInterviews.map((interview, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg">
                      <h4 className="font-medium text-sm">{interview.company}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{interview.position}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span>{interview.date} at {interview.time}</span>
                        <Badge variant="secondary" className="text-xs">{interview.type}</Badge>
                      </div>
                      <Button size="sm" className="w-full mt-2 bg-gradient-hero hover:opacity-90">
                        <PlayCircle className="w-3 h-3 mr-1" />
                        Practice for This
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-gradient-success/10 border-secondary shadow-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-secondary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">Pro Tip</h4>
                      <p className="text-xs text-muted-foreground">
                        Practice the same question multiple times to improve your delivery and timing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MockInterviews;
