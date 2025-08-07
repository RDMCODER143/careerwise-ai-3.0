
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Award, 
  Code, 
  Globe, 
  Wrench,
  CheckCircle,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";

interface RoadmapPhase {
  title: string;
  duration: string;
  description: string;
  skills: string[];
  resources: string[];
}

interface CareerRoadmap {
  overview: string;
  phases: RoadmapPhase[];
  certifications: string[];
  projects: string[];
  resources: {
    books: string[];
    courses: string[];
    websites: string[];
    tools: string[];
  };
  rawContent?: string;
}

interface CareerRoadmapProps {
  roadmap: CareerRoadmap;
  careerTitle: string;
}

const CareerRoadmap: React.FC<CareerRoadmapProps> = ({ roadmap, careerTitle }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Career Roadmap: {careerTitle}</h2>
        <p className="text-muted-foreground">{roadmap.overview}</p>
      </div>

      <Tabs defaultValue="phases" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="phases">Learning Path</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-4">
          {roadmap.phases.map((phase, index) => (
            <Card key={index} className="bg-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  {phase.title}
                  <Badge variant="outline" className="ml-auto">
                    <Clock className="w-3 h-3 mr-1" />
                    {phase.duration}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{phase.description}</p>
                
                {phase.skills.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Skills to Master:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {phase.resources.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Recommended Resources:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {phase.resources.map((resource, resIndex) => (
                        <li key={resIndex}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Award className="w-5 h-5 text-secondary" />
                </div>
                Key Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {roadmap.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Code className="w-5 h-5 text-accent" />
                </div>
                Portfolio Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {roadmap.projects.map((project, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Code className="w-5 h-5 text-accent" />
                    <span>{project}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Books
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {roadmap.resources.books.map((book, index) => (
                    <li key={index} className="text-sm text-muted-foreground">• {book}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-secondary" />
                  Online Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {roadmap.resources.courses.map((course, index) => (
                    <li key={index} className="text-sm text-muted-foreground">• {course}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" />
                  Websites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {roadmap.resources.websites.map((site, index) => (
                    <li key={index} className="text-sm text-muted-foreground">• {site}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-primary" />
                  Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {roadmap.resources.tools.map((tool, index) => (
                    <li key={index} className="text-sm text-muted-foreground">• {tool}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareerRoadmap;
