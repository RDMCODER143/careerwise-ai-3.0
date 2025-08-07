
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export const useCareerWiseChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hi! I'm your AI career assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    // Add user message
    const userMessageObj: ChatMessage = {
      id: Date.now().toString(),
      message: userMessage,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessageObj]);

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('careerwise-chatbot', {
        body: {
          message: userMessage,
          userRole: profile?.role || 'job_seeker',
          context: {
            userName: profile?.full_name,
            userRole: profile?.role
          }
        }
      });

      if (error) {
        throw error;
      }

      // Add bot response
      const botMessageObj: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: data.response,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessageObj]);

    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      // Add error message
      const errorMessageObj: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        message: "Hi! I'm your AI career assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date()
      }
    ]);
  };

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading
  };
};
