
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InterviewSession {
  type: 'technical' | 'behavioral' | 'system_design';
  isActive: boolean;
  currentQuestion: string;
  questionNumber: number;
  responses: Array<{
    question: string;
    response: string;
    feedback?: string;
  }>;
  startTime?: Date;
  endTime?: Date;
}

export interface InterviewEvaluation {
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
  recommendations: string;
}

export const useMockInterview = () => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const { toast } = useToast();

  const startInterview = useCallback(async (type: 'technical' | 'behavioral' | 'system_design') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mock-interview', {
        body: { type, action: 'start' }
      });

      if (error) throw error;

      setSession({
        type,
        isActive: true,
        currentQuestion: data.question,
        questionNumber: 1,
        responses: [],
        startTime: new Date()
      });

      toast({
        title: "Interview Started",
        description: `Your ${type.replace('_', ' ')} interview has begun!`,
      });

    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: "Error",
        description: "Failed to start interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const submitResponse = useCallback(async (response: string) => {
    if (!session) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mock-interview', {
        body: {
          type: session.type,
          action: 'question',
          userResponse: response,
          questionNumber: session.questionNumber,
          context: {
            responses: session.responses,
            currentQuestion: session.currentQuestion
          }
        }
      });

      if (error) throw error;

      const newResponse = {
        question: session.currentQuestion,
        response,
        feedback: data.feedback
      };

      setSession(prev => prev ? {
        ...prev,
        currentQuestion: data.question,
        questionNumber: data.questionNumber,
        responses: [...prev.responses, newResponse]
      } : null);

    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: "Error",
        description: "Failed to submit response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, toast]);

  const endInterview = useCallback(async (finalResponse?: string) => {
    if (!session) return;

    setIsLoading(true);
    try {
      const allResponses = finalResponse ? [
        ...session.responses,
        { question: session.currentQuestion, response: finalResponse }
      ] : session.responses;

      const { data, error } = await supabase.functions.invoke('mock-interview', {
        body: {
          type: session.type,
          action: 'evaluate',
          userResponse: finalResponse,
          context: {
            responses: allResponses,
            questionNumber: session.questionNumber,
            duration: session.startTime ? new Date().getTime() - session.startTime.getTime() : 0
          }
        }
      });

      if (error) throw error;

      setEvaluation(data);
      setSession(prev => prev ? {
        ...prev,
        isActive: false,
        endTime: new Date()
      } : null);

      toast({
        title: "Interview Completed",
        description: "Your interview has been evaluated!",
      });

    } catch (error) {
      console.error('Error ending interview:', error);
      toast({
        title: "Error",
        description: "Failed to evaluate interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, toast]);

  const resetInterview = useCallback(() => {
    setSession(null);
    setEvaluation(null);
  }, []);

  return {
    session,
    evaluation,
    isLoading,
    startInterview,
    submitResponse,
    endInterview,
    resetInterview
  };
};
