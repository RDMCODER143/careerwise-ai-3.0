
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface JobPosting {
  id: string;
  employer_id: string;
  title: string;
  department: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  job_type: string;
  status: 'Active' | 'Paused' | 'Draft' | 'Closed';
  description?: string;
  requirements?: string[];
  benefits?: string[];
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export const useJobPostings = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch job postings
  const { data, isLoading, error } = useQuery({
    queryKey: ['jobPostings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as JobPosting[];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('job_postings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'job_postings' },
        (payload) => {
          console.log('Job posting change:', payload);
          queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
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
      setJobPostings(data);
    }
  }, [data]);

  // Create job posting mutation
  const createJobPostingMutation = useMutation({
    mutationFn: async (newJobPosting: Omit<JobPosting, 'id' | 'created_at' | 'updated_at' | 'employer_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('job_postings')
        .insert([{ ...newJobPosting, employer_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
      toast({ title: 'Success', description: 'Job posting created successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to create job posting: ${error.message}`, variant: 'destructive' });
    },
  });

  // Update job posting mutation
  const updateJobPostingMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<JobPosting> }) => {
      const { data, error } = await supabase
        .from('job_postings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
      toast({ title: 'Success', description: 'Job posting updated successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to update job posting: ${error.message}`, variant: 'destructive' });
    },
  });

  // Delete job posting mutation
  const deleteJobPostingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
      toast({ title: 'Success', description: 'Job posting deleted successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Failed to delete job posting: ${error.message}`, variant: 'destructive' });
    },
  });

  return {
    jobPostings,
    isLoading,
    error,
    createJobPosting: (data: any, options?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
      createJobPostingMutation.mutate(data, options);
    },
    updateJobPosting: (data: { id: string; updates: Partial<JobPosting> }, options?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
      updateJobPostingMutation.mutate(data, options);
    },
    deleteJobPosting: deleteJobPostingMutation.mutate,
    isCreating: createJobPostingMutation.isPending,
    isUpdating: updateJobPostingMutation.isPending,
    isDeleting: deleteJobPostingMutation.isPending,
  };
};
