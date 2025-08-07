import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import MockInterviewInterface from '@/components/MockInterviewInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Video, 
  Calendar, 
  Clock, 
  Award,
  TrendingUp,
  Star,
  Play,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const MockInterviews: React.FC = () => {
  const [showInterview, setShowInterview] = useState(false);
  const [selectedInterviewType, setSelectedInterviewType] = useState<'technical' | 'behavioral' | 'system_design'>('technical');

  const interviewTypes = [
    { 
      type: "technical", 
      description: "Coding challenges and technical problem solving",
      duration: "45 min",
      difficulty: "Medium",
      questions: 8,
      color: "bg-blue-500"
    },
    { 
      type: "behavioral", 
      description: "Situational and behavioral questions",
      duration: "30 min",
      difficulty: "Easy",
      questions: 6,
      color: "bg-green-500"
    },
    { 
      type: "system_design", 
      description: "Architecture and scalability discussions",
      duration: "60 min",
      difficulty: "Hard",
      questions: 4,
      color: "bg-red-500"
    }
  ];

  const pastInterviews = [
    { date: "2024-08-05", type: "Technical", score: 85, feedback: "Strong problem-solving skills" },
    { date: "2024-08-03", type: "Behavioral", score: 92, feedback: "Excellent communication" },
    { date: "2024-08-01", type: "System Design", score: 78, feedback: "Good architectural thinking" }
  ];

  const overallStats = {
    totalInterviews: 12,
    averageScore: 85,
    improvement: "+15%",
    strongAreas: ["Problem Solving", "Communication", "Technical Knowledge"],
    improvementAreas: ["System Design", "Time Management"]
  };

  const startInterview = (type: 'technical' | 'behavioral' | 'system_design') => {
    setSelectedInterviewType(type);
    setShowInterview(true);
  };

  return (
    <div className="flex h-screen bg-gradient-subtle font-poppins">
      <AppSidebar userRole="job_seeker" />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-[#9b2c2c] to-[#7a1f1f] text-white p-6 shadow-elegant">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Mock Interviews</h1>
            <p className="text-white/90 text-lg">
              Practice with AI-powered interviews to ace your next opportunity
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Performance Overview */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#9b2c2c]/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-[#9b2c2c]" />
                </div>
                Your Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-[#9b2c2c]/10 rounded-xl">
                  <div className="text-2xl font-bold text-[#9b2c2c] mb-1">{overallStats.totalInterviews}</div>
                  <p className="text-sm text-[#9b2c2c]/70">Total Interviews</p>
                </div>
                <div className="text-center p-4 bg-[#9b2c2c]/10 rounded-xl">
                  <div className="text-2xl font-bold text-[#9b2c2c] mb-1">{overallStats.averageScore}%</div>
                  <p className="text-sm text-[#9b2c2c]/70">Average Score</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-800 mb-1">{overallStats.improvement}</div>
                  <p className="text-sm text-green-700">Improvement</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-800 mb-1">A-</div>
                  <p className="text-sm text-blue-700">Overall Grade</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-800">Strong Areas</h4>
                  {overallStats.strongAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-800">Areas for Improvement</h4>
                  {overallStats.improvementAreas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Types */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#9b2c2c]/10 rounded-lg">
                  <Video className="w-5 h-5 text-[#9b2c2c]" />
                </div>
                Start New Interview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {interviewTypes.map((interview, index) => (
                  <div key={index} className="p-4 border border-border rounded-xl hover:shadow-card transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{interview.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                      <Badge variant="outline" className={`${interview.color} text-white border-none`}>
                        {interview.difficulty}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{interview.description}</p>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{interview.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{interview.questions} questions</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-[#9b2c2c] to-[#7a1f1f] hover:from-[#7a1f1f] hover:to-[#5a1515] text-white"
                      onClick={() => startInterview(interview.type)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start {interview.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Interviews */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#9b2c2c]/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#9b2c2c]" />
                </div>
                Recent Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastInterviews.map((interview, index) => (
                  <div key={index} className="p-4 border border-border rounded-xl hover:shadow-card transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{interview.type} Interview</h4>
                        <p className="text-sm text-muted-foreground">{interview.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold">{interview.score}%</span>
                        </div>
                        <Badge variant="secondary" className={interview.score >= 90 ? "bg-green-100 text-green-800" : interview.score >= 80 ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}>
                          {interview.score >= 90 ? "Excellent" : interview.score >= 80 ? "Good" : "Needs Improvement"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{interview.feedback}</p>
                    <Button variant="outline" size="sm" className="border-[#9b2c2c] text-[#9b2c2c] hover:bg-[#9b2c2c] hover:text-white">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interview Dialog */}
        <Dialog open={showInterview} onOpenChange={setShowInterview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                {selectedInterviewType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Interview
              </DialogTitle>
            </DialogHeader>
            <MockInterviewInterface 
              type={selectedInterviewType}
              onBack={() => setShowInterview(false)}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MockInterviews;
