
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useCareerRoadmap = () => {
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateRoadmap = async (careerTitle: string, userSkills?: string[], experienceLevel?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Generating roadmap for:', careerTitle);
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-career-roadmap', {
        body: {
          careerTitle,
          userSkills,
          experienceLevel
        }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message || 'Failed to generate roadmap');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      console.log('Roadmap generated successfully');
      setRoadmap(data);
      
      toast({
        title: "Roadmap Generated",
        description: `Career roadmap for ${careerTitle} has been created successfully!`,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate roadmap';
      console.error('Error generating roadmap:', errorMessage);
      setError(errorMessage);
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    roadmap,
    isLoading,
    error,
    generateRoadmap,
  };
};
