
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobPosting } from './useJobPostings';

export interface Candidate {
  id: string;
  job_posting_id: string;
  job_seeker_id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  experience_years?: number;
  skills?: string[];
  resume_url?: string;
  cover_letter?: string;
  status: 'New Application' | 'Under Review' | 'Phone Screen' | 'Interview Scheduled' | 'Rejected' | 'Hired';
  match_score: number;
  applied_at: string;
  updated_at: string;
  job_posting?: JobPosting;
}

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch candidates with job posting details
  const { data, isLoading, error } = useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      // First get candidates
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('candidates')
        .select('*')
        .order('applied_at', { ascending: false });

      if (candidatesError) throw candidatesError;

      // Then get job postings for each candidate
      const candidatesWithJobs = await Promise.all(
        (candidatesData || []).map(async (candidate) => {
          const { data: jobData, error: jobError } = await supabase
            .from('job_postings')
            .select('*')
            .eq('id', candidate.job_posting_id)
            .single();

          if (jobError) {
            console.error('Error fetching job posting:', jobError);
            return candidate;
          }

          return {
            ...candidate,
            job_posting: jobData as JobPosting
          };
        })
      );

      return candidatesWithJobs as Candidate[];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('candidates_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'candidates' },
        (payload) => {
          console.log('Candidate change:', payload);
          queryClient.invalidateQueries({ queryKey: ['candidates'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Update local state when data changes
  useEffect(() => {
    if (data) {
      setCandidates(data);
    }
  }, [data]);

  // Update candidate status mutation
  const updateCandidateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Candidate['status'] }) => {
      const { data, error } = await supabase
        .from('candidates')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({ title: 'Success', description: 'Candidate status updated successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to update candidate status: ${error.message}`, variant: 'destructive' });
    },
  });

  // Create candidate application mutation (for job seekers)
  const createApplication = useMutation({
    mutationFn: async (applicationData: Omit<Candidate, 'id' | 'applied_at' | 'updated_at' | 'job_seeker_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('candidates')
        .insert([{ ...applicationData, job_seeker_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({ title: 'Success', description: 'Application submitted successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to submit application: ${error.message}`, variant: 'destructive' });
    },
  });

  // Delete candidate application mutation
  const deleteApplication = useMutation({
    mutationFn: async (applicationId: string) => {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({ title: 'Success', description: 'Application deleted successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to delete application: ${error.message}`, variant: 'destructive' });
    },
  });

  return {
    candidates,
    isLoading,
    error,
    updateCandidateStatus: updateCandidateStatus.mutate,
    createApplication: createApplication.mutate,
    deleteApplication: deleteApplication.mutate,
    isUpdating: updateCandidateStatus.isPending,
    isCreatingApplication: createApplication.isPending,
    isDeletingApplication: deleteApplication.isPending,
  };
};
