
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CareerSuggestion {
  id: string;
  user_id: string;
  career_title: string;
  match_score: number;
  justification: string;
  required_skills: string[] | null;
  growth_rate: string | null;
  salary_range: string | null;
  is_primary: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useCareerSuggestions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['career-suggestions', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('career_suggestions')
        .select('*')
        .eq('user_id', user.id)
        .order('match_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
};
