
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InterviewRequest {
  type: 'technical' | 'behavioral' | 'system_design';
  action: 'start' | 'question' | 'evaluate';
  userResponse?: string;
  questionNumber?: number;
  context?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, action, userResponse, questionNumber, context }: InterviewRequest = await req.json();
    
    console.log(`Processing ${action} action for ${type} interview`);
    
    let apiKey: string;
    let systemPrompt: string;
    
    // Select appropriate API key and system prompt based on interview type
    switch (type) {
      case 'technical':
        apiKey = Deno.env.get('GEMINI_TECHNICAL_API_KEY')!;
        systemPrompt = `You are a technical interviewer for software engineering positions. 
        Focus on coding problems, algorithms, data structures, and technical concepts.
        Ask progressive questions that test problem-solving skills.
        Provide constructive feedback and follow-up questions based on responses.`;
        break;
      case 'behavioral':
        apiKey = Deno.env.get('GEMINI_BEHAVIORAL_API_KEY')!;
        systemPrompt = `You are a behavioral interviewer focusing on soft skills and cultural fit.
        Ask questions about past experiences, teamwork, leadership, and problem-solving.
        Use the STAR method (Situation, Task, Action, Result) to evaluate responses.
        Provide feedback on communication skills and cultural alignment.`;
        break;
      case 'system_design':
        apiKey = Deno.env.get('GEMINI_SYSTEM_DESIGN_API_KEY')!;
        systemPrompt = `You are a system design interviewer for senior engineering roles.
        Focus on scalability, architecture, trade-offs, and system components.
        Ask about load balancing, databases, caching, microservices, and distributed systems.
        Evaluate architectural thinking and ability to handle large-scale systems.`;
        break;
      default:
        throw new Error('Invalid interview type');
    }

    if (!apiKey) {
      console.error(`Missing API key for ${type} interview`);
      throw new Error(`API key not configured for ${type} interview`);
    }

    let prompt = '';
    
    switch (action) {
      case 'start':
        prompt = `${systemPrompt}
        
        Start a ${type} interview. Provide:
        1. A brief welcome message
        2. An overview of what to expect
        3. The first question
        
        Format your response as JSON with: { "welcome": "...", "overview": "...", "question": "...", "questionNumber": 1 }`;
        break;
        
      case 'question':
        prompt = `${systemPrompt}
        
        Previous context: ${JSON.stringify(context)}
        User's response to question ${questionNumber}: "${userResponse}"
        
        Provide:
        1. Brief feedback on the previous response (2-3 sentences)
        2. The next question (question number ${(questionNumber || 0) + 1})
        
        Format as JSON: { "feedback": "...", "question": "...", "questionNumber": ${(questionNumber || 0) + 1} }`;
        break;
        
      case 'evaluate':
        prompt = `${systemPrompt}
        
        Interview context: ${JSON.stringify(context)}
        Final response: "${userResponse}"
        
        Provide a comprehensive evaluation with:
        1. Overall score (0-100)
        2. Strengths (array of strings)
        3. Areas for improvement (array of strings)
        4. Detailed feedback (paragraph)
        5. Specific recommendations for improvement
        
        Format as JSON: { "score": number, "strengths": [], "improvements": [], "feedback": "...", "recommendations": "..." }`;
        break;
    }

    console.log('Making request to Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    console.log(`Gemini API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error('No generated text in Gemini response:', data);
      throw new Error('No response content from Gemini API');
    }

    console.log('Generated text received:', generatedText.substring(0, 100) + '...');

    // Try to parse as JSON, fallback to plain text if needed
    let result;
    try {
      // Clean up the response text to handle potential markdown formatting
      const cleanText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleanText);
    } catch (parseError) {
      console.warn('Failed to parse as JSON, returning plain text:', parseError);
      result = { content: generatedText };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in mock-interview function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
