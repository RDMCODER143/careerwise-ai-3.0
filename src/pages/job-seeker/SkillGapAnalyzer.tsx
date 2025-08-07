
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  BookOpen, 
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  Zap,
  Clock,
  Star,
  ChevronRight
} from "lucide-react";

const SkillGapAnalyzer: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");

  // Mock data for skill gap analysis
  const skillGaps = [
    {
      category: "Technical Skills",
      skills: [
        { name: "React.js", currentLevel: 85, requiredLevel: 90, gap: 5, priority: "Medium", courses: 3 },
        { name: "TypeScript", currentLevel: 60, requiredLevel: 85, gap: 25, priority: "High", courses: 5 },
        { name: "Node.js", currentLevel: 40, requiredLevel: 75, gap: 35, priority: "High", courses: 8 },
        { name: "AWS", currentLevel: 30, requiredLevel: 70, gap: 40, priority: "High", courses: 12 },
        { name: "Docker", currentLevel: 25, requiredLevel: 60, gap: 35, priority: "Medium", courses: 6 }
      ]
    },
    {
      category: "Soft Skills",
      skills: [
        { name: "Leadership", currentLevel: 70, requiredLevel: 80, gap: 10, priority: "Medium", courses: 4 },
        { name: "Communication", currentLevel: 80, requiredLevel: 85, gap: 5, priority: "Low", courses: 2 },
        { name: "Project Management", currentLevel: 50, requiredLevel: 75, gap: 25, priority: "High", courses: 7 }
      ]
    }
  ];

  const recommendedCourses = [
    { name: "Advanced TypeScript Patterns", provider: "Tech Academy", duration: "6 weeks", rating: 4.8, price: "₹2,999" },
    { name: "Node.js Masterclass", provider: "DevCourse", duration: "8 weeks", rating: 4.9, price: "₹3,999" },
    { name: "AWS Solutions Architect", provider: "Cloud Institute", duration: "12 weeks", rating: 4.7, price: "₹8,999" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-subtle font-poppins">
      <AppSidebar userRole="job_seeker" />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-red-800 to-red-900 text-white p-6 shadow-elegant">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Skill Gap Analyzer</h1>
            <p className="text-white/90 text-lg">
              Identify skill gaps and get personalized learning recommendations
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Role Selection */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-red-800/10 rounded-lg">
                  <Target className="w-5 h-5 text-red-800" />
                </div>
                Target Role Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Current Analysis: {selectedRole}</h3>
                  <p className="text-red-700 text-sm">Based on current job market requirements</p>
                </div>
                <Button variant="outline" className="border-red-800 text-red-800 hover:bg-red-800 hover:text-white">
                  Change Role
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skill Gap Analysis */}
          {skillGaps.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="bg-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-red-800/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-red-800" />
                  </div>
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.skills.map((skill, index) => (
                  <div key={index} className="p-4 border border-border rounded-xl hover:shadow-card transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-lg">{skill.name}</h4>
                        <Badge className={`px-3 py-1 text-xs ${getPriorityTextColor(skill.priority)}`}>
                          {skill.priority} Priority
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Gap: {skill.gap}%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Current Level</span>
                        <span>{skill.currentLevel}%</span>
                      </div>
                      <div className="relative">
                        <Progress value={skill.currentLevel} className="h-2 bg-gray-200" />
                        <div 
                          className="absolute top-0 h-2 bg-red-200 rounded-full"
                          style={{ left: `${skill.currentLevel}%`, width: `${skill.gap}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Required: {skill.requiredLevel}%</span>
                        <span>{skill.courses} courses available</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-800 text-red-800 hover:bg-red-800 hover:text-white">
                        View Courses
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Recommended Learning Path */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-red-800/10 rounded-lg">
                  <Award className="w-5 h-5 text-red-800" />
                </div>
                Recommended Learning Path
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedCourses.map((course, index) => (
                <div key={index} className="p-4 border border-border rounded-xl hover:shadow-card transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{course.name}</h4>
                      <p className="text-muted-foreground text-sm mb-2">{course.provider}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{course.rating}</span>
                        </div>
                        <div className="font-semibold text-red-800">{course.price}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white">
                      Enroll Now
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-800 text-red-800 hover:bg-red-800 hover:text-white">
                      Learn More
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Plan */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-red-800/10 rounded-lg">
                  <Zap className="w-5 h-5 text-red-800" />
                </div>
                Your 90-Day Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-800 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <h4 className="font-semibold">Weeks 1-4: TypeScript Fundamentals</h4>
                  </div>
                  <p className="text-muted-foreground text-sm ml-11">Master TypeScript basics and advanced patterns</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <h4 className="font-semibold">Weeks 5-8: Node.js Backend Development</h4>
                  </div>
                  <p className="text-muted-foreground text-sm ml-11">Build full-stack applications with Node.js</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <h4 className="font-semibold">Weeks 9-12: AWS Cloud Deployment</h4>
                  </div>
                  <p className="text-muted-foreground text-sm ml-11">Deploy and manage applications on AWS</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button className="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Start Your Learning Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SkillGapAnalyzer;
