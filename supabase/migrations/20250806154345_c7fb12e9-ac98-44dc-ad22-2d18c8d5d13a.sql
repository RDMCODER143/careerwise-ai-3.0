
-- Create table for resume analysis results
CREATE TABLE public.resume_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  resume_id UUID REFERENCES public.resumes(id),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  feedback TEXT NOT NULL,
  keywords_missing TEXT[],
  strengths TEXT[],
  weaknesses TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for career path suggestions
CREATE TABLE public.career_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  career_title TEXT NOT NULL,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  justification TEXT NOT NULL,
  required_skills TEXT[],
  growth_rate TEXT,
  salary_range TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS policies for resume_analysis
CREATE POLICY "Users can view their own resume analysis" 
  ON public.resume_analysis 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resume analysis" 
  ON public.resume_analysis 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume analysis" 
  ON public.resume_analysis 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for career_suggestions
CREATE POLICY "Users can view their own career suggestions" 
  ON public.career_suggestions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own career suggestions" 
  ON public.career_suggestions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own career suggestions" 
  ON public.career_suggestions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_resume_analysis_updated_at 
  BEFORE UPDATE ON public.resume_analysis 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_career_suggestions_updated_at 
  BEFORE UPDATE ON public.career_suggestions 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
