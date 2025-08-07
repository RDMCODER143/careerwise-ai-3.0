
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ResumeAnalysis {
  id: string;
  user_id: string;
  resume_id: string | null;
  score: number;
  feedback: string;
  keywords_missing: string[] | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useResumeAnalysis = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['resume-analysis', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('resume_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};
