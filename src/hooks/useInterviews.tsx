
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Interview {
  id: string;
  candidate_id: string;
  job_posting_id: string;
  scheduled_at?: string;
  interview_type: string;
  meeting_link?: string;
  notes?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  created_at: string;
  updated_at: string;
}

export const useInterviews = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch interviews using raw query to bypass type issues
  const { data: interviews = [], isLoading, error } = useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interviews' as any)
        .select('*')
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return (data || []) as unknown as Interview[];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('interviews_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'interviews' },
        (payload) => {
          console.log('Interview change:', payload);
          queryClient.invalidateQueries({ queryKey: ['interviews'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Schedule interview mutation
  const scheduleInterviewMutation = useMutation({
    mutationFn: async (interviewData: Omit<Interview, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('interviews' as any)
        .insert([interviewData])
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Interview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      toast({ title: 'Success', description: 'Interview scheduled successfully!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: `Failed to schedule interview: ${error.message}`, variant: 'destructive' });
    },
  });

  // Update interview mutation
  const updateInterviewMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Interview> }) => {
      const { data, error } = await supabase
        .from('interviews' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Interview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      toast({ title: 'Success', description: 'Interview updated successfully!' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: `Failed to update interview: ${error.message}`, variant: 'destructive' });
    },
  });

  return {
    interviews,
    isLoading,
    error,
    scheduleInterview: scheduleInterviewMutation.mutate,
    updateInterview: updateInterviewMutation.mutate,
    isScheduling: scheduleInterviewMutation.isPending,
    isUpdating: updateInterviewMutation.isPending,
  };
};
