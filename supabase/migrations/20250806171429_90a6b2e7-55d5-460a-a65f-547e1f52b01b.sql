
-- Create job_postings table
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  job_type TEXT NOT NULL DEFAULT 'Full-time',
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Draft', 'Closed')),
  description TEXT,
  requirements TEXT[],
  benefits TEXT[],
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create candidates table
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_posting_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE NOT NULL,
  job_seeker_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  experience_years INTEGER,
  skills TEXT[],
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'New Application' CHECK (status IN ('New Application', 'Under Review', 'Phone Screen', 'Interview Scheduled', 'Rejected', 'Hired')),
  match_score INTEGER DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for job_postings
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view their own job postings" 
  ON public.job_postings 
  FOR SELECT 
  USING (auth.uid() = employer_id);

CREATE POLICY "Employers can create their own job postings" 
  ON public.job_postings 
  FOR INSERT 
  WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Employers can update their own job postings" 
  ON public.job_postings 
  FOR UPDATE 
  USING (auth.uid() = employer_id);

CREATE POLICY "Employers can delete their own job postings" 
  ON public.job_postings 
  FOR DELETE 
  USING (auth.uid() = employer_id);

-- Job seekers can view active job postings
CREATE POLICY "Job seekers can view active job postings" 
  ON public.job_postings 
  FOR SELECT 
  USING (status = 'Active');

-- Add RLS policies for candidates
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view candidates for their job postings" 
  ON public.candidates 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.job_postings 
      WHERE job_postings.id = candidates.job_posting_id 
      AND job_postings.employer_id = auth.uid()
    )
  );

CREATE POLICY "Job seekers can create applications" 
  ON public.candidates 
  FOR INSERT 
  WITH CHECK (auth.uid() = job_seeker_id);

CREATE POLICY "Job seekers can view their own applications" 
  ON public.candidates 
  FOR SELECT 
  USING (auth.uid() = job_seeker_id);

CREATE POLICY "Employers can update candidate status" 
  ON public.candidates 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.job_postings 
      WHERE job_postings.id = candidates.job_posting_id 
      AND job_postings.employer_id = auth.uid()
    )
  );

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_postings_updated_at 
  BEFORE UPDATE ON public.job_postings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at 
  BEFORE UPDATE ON public.candidates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for both tables
ALTER TABLE public.job_postings REPLICA IDENTITY FULL;
ALTER TABLE public.candidates REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_postings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidates;

-- Insert some sample data for testing
INSERT INTO public.job_postings (employer_id, title, department, location, salary_min, salary_max, job_type, status, description, requirements, benefits, expires_at)
SELECT 
  auth.uid(),
  'Senior Frontend Developer',
  'Engineering',
  'San Francisco, CA',
  120000,
  160000,
  'Full-time',
  'Active',
  'We are looking for a skilled Senior Frontend Developer to join our dynamic team.',
  ARRAY['React', 'TypeScript', 'Node.js', '5+ years experience'],
  ARRAY['Health Insurance', 'Remote Work', 'Professional Development'],
  now() + interval '30 days'
WHERE auth.uid() IS NOT NULL;

INSERT INTO public.job_postings (employer_id, title, department, location, salary_min, salary_max, job_type, status, description, requirements, benefits, expires_at)
SELECT 
  auth.uid(),
  'Product Manager',
  'Product',
  'Remote',
  140000,
  180000,
  'Full-time',
  'Active',
  'Join our product team to drive innovation and growth.',
  ARRAY['Product Strategy', 'Analytics', 'Agile', '7+ years experience'],
  ARRAY['Equity', 'Flexible Hours', 'Learning Budget'],
  now() + interval '25 days'
WHERE auth.uid() IS NOT NULL;
