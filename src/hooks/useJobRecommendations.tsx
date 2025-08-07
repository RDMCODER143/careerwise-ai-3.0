
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface JobRecommendation {
  id: string;
  title: string;
  employer_id: string;
  department: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  job_type: string;
  status: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  created_at: string;
}

export const useJobRecommendations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: jobRecommendations = [], isLoading, error } = useQuery({
    queryKey: ['job-recommendations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as JobRecommendation[];
    },
    enabled: !!user?.id,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('job_recommendations_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'job_postings' },
        (payload) => {
          console.log('Job posting change:', payload);
          queryClient.invalidateQueries({ queryKey: ['job-recommendations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return {
    jobRecommendations,
    isLoading,
    error,
  };
};
