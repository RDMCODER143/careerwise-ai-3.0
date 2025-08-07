
-- Add interview scheduling table
CREATE TABLE public.interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES public.candidates(id) NOT NULL,
  job_posting_id UUID REFERENCES public.job_postings(id) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  interview_type TEXT DEFAULT 'Phone Screen',
  meeting_link TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for interviews table
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Employers can manage interviews for their job postings
CREATE POLICY "Employers can view interviews for their job postings" 
  ON public.interviews 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM job_postings 
    WHERE job_postings.id = interviews.job_posting_id 
    AND job_postings.employer_id = auth.uid()
  ));

CREATE POLICY "Employers can create interviews for their job postings" 
  ON public.interviews 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM job_postings 
    WHERE job_postings.id = interviews.job_posting_id 
    AND job_postings.employer_id = auth.uid()
  ));

CREATE POLICY "Employers can update interviews for their job postings" 
  ON public.interviews 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM job_postings 
    WHERE job_postings.id = interviews.job_posting_id 
    AND job_postings.employer_id = auth.uid()
  ));

-- Job seekers can view their own interviews
CREATE POLICY "Job seekers can view their own interviews" 
  ON public.interviews 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM candidates 
    WHERE candidates.id = interviews.candidate_id 
    AND candidates.job_seeker_id = auth.uid()
  ));

-- Add trigger for updating updated_at
CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON public.interviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all relevant tables
ALTER TABLE public.candidates REPLICA IDENTITY FULL;
ALTER TABLE public.interviews REPLICA IDENTITY FULL;
ALTER TABLE public.job_postings REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_postings;
