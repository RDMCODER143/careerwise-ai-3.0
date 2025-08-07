import React from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  Award,
  Clock,
  Star,
  PlayCircle,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const SkillGapAnalyzer: React.FC = () => {
  const skillGaps = [
    {
      skill: "TypeScript",
      currentLevel: 30,
      targetLevel: 85,
      importance: "High",
      timeToLearn: "3-4 months",
      courses: [
        { 
          name: "TypeScript Fundamentals", 
          provider: "Udemy", 
          rating: 4.8, 
          duration: "8 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
          thumbnailUrl: "https://img.youtube.com/vi/BwuLxPH8IDs/maxresdefault.jpg"
        },
        { 
          name: "Advanced TypeScript", 
          provider: "Pluralsight", 
          rating: 4.6, 
          duration: "12 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=ahCwqrYpIuM",
          thumbnailUrl: "https://img.youtube.com/vi/ahCwqrYpIuM/maxresdefault.jpg"
        },
        { 
          name: "TypeScript in React", 
          provider: "Frontend Masters", 
          rating: 4.9, 
          duration: "6 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=Z5iWr6Srsj8",
          thumbnailUrl: "https://img.youtube.com/vi/Z5iWr6Srsj8/maxresdefault.jpg"
        }
      ],
      jobDemand: 92
    },
    {
      skill: "Node.js",
      currentLevel: 45,
      targetLevel: 80,
      importance: "Medium",
      timeToLearn: "2-3 months",
      courses: [
        { 
          name: "Complete Node.js Course", 
          provider: "Udemy", 
          rating: 4.7, 
          duration: "15 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
          thumbnailUrl: "https://img.youtube.com/vi/TlB_eWDSMt4/maxresdefault.jpg"
        },
        { 
          name: "Node.js API Development", 
          provider: "Coursera", 
          rating: 4.5, 
          duration: "10 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
          thumbnailUrl: "https://img.youtube.com/vi/fBNz5xF-Kx4/maxresdefault.jpg"
        },
        { 
          name: "Node.js Express Framework", 
          provider: "FreeCodeCamp", 
          rating: 4.8, 
          duration: "8 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=Oe421EPjeBE",
          thumbnailUrl: "https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg"
        },
        { 
          name: "Node.js MongoDB Tutorial", 
          provider: "Programming with Mosh", 
          rating: 4.6, 
          duration: "6 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=pWbMrx5rVBE",
          thumbnailUrl: "https://img.youtube.com/vi/pWbMrx5rVBE/maxresdefault.jpg"
        },
        { 
          name: "Node.js Authentication", 
          provider: "Traversy Media", 
          rating: 4.7, 
          duration: "4 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=6FOq4cUdH8k",
          thumbnailUrl: "https://img.youtube.com/vi/6FOq4cUdH8k/maxresdefault.jpg"
        }
      ],
      jobDemand: 88
    },
    {
      skill: "AWS",
      currentLevel: 15,
      targetLevel: 70,
      importance: "Medium",
      timeToLearn: "4-5 months",
      courses: [
        { 
          name: "AWS Fundamentals", 
          provider: "AWS Training", 
          rating: 4.6, 
          duration: "20 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=ulprqHHWlng",
          thumbnailUrl: "https://img.youtube.com/vi/ulprqHHWlng/maxresdefault.jpg"
        },
        { 
          name: "AWS Solutions Architect", 
          provider: "A Cloud Guru", 
          rating: 4.8, 
          duration: "25 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
          thumbnailUrl: "https://img.youtube.com/vi/Ia-UEYYR44s/maxresdefault.jpg"
        },
        { 
          name: "AWS EC2 Complete Guide", 
          provider: "TechWorld with Nana", 
          rating: 4.7, 
          duration: "3 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=iHX-jtKIVNA",
          thumbnailUrl: "https://img.youtube.com/vi/iHX-jtKIVNA/maxresdefault.jpg"
        },
        { 
          name: "AWS Lambda Functions", 
          provider: "FreeCodeCamp", 
          rating: 4.5, 
          duration: "5 hours",
          youtubeUrl: "https://www.youtube.com/watch?v=eOBq__h4OJ4",
          thumbnailUrl: "https://img.youtube.com/vi/eOBq__h4OJ4/maxresdefault.jpg"
        }
      ],
      jobDemand: 75
    }
  ];

  const currentSkills = [
    { name: "React", level: 85, category: "Frontend" },
    { name: "JavaScript", level: 80, category: "Programming" },
    { name: "CSS/Tailwind", level: 75, category: "Styling" },
    { name: "Git", level: 70, category: "Tools" },
    { name: "HTML", level: 90, category: "Markup" }
  ];

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const handleStartLearning = (youtubeUrl: string) => {
    console.log('Opening YouTube URL:', youtubeUrl);
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleViewCompleteRoadmap = (skill: string) => {
    console.log('Viewing complete roadmap for:', skill);
    // This could navigate to a detailed learning roadmap page
  };

  return (
    <div className="flex h-screen bg-gradient-subtle font-poppins">
      <AppSidebar userRole="job_seeker" />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-gradient-hero text-white p-6 shadow-elegant">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Skill Gap Analysis - Bridge to Your Dream Role</h1>
            <p className="text-white/90 text-lg">
              Identify and bridge skill gaps for your target roles
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Skill Gap Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillGaps.map((gap, index) => (
              <Card key={index} className="bg-card shadow-card border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{gap.skill}</CardTitle>
                    <Badge className={`text-white text-xs ${getImportanceColor(gap.importance)}`}>
                      {gap.importance}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {gap.courses.length} courses available
                  </div>
                  
                  {/* Course Thumbnails */}
                  <div className="grid grid-cols-2 gap-2">
                    {gap.courses.slice(0, 4).map((course, courseIndex) => (
                      <div 
                        key={courseIndex} 
                        className="relative cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handleStartLearning(course.youtubeUrl)}
                      >
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.name}
                          className="w-full h-16 rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"; // Fallback thumbnail
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center hover:bg-black/30 transition-colors">
                          <PlayCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="bg-black/70 text-white text-xs px-1 py-0.5 rounded text-center truncate">
                            {course.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={() => handleStartLearning(gap.courses[0]?.youtubeUrl)}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Learning
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewCompleteRoadmap(gap.skill)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Complete Learning Roadmap
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkillGapAnalyzer;
