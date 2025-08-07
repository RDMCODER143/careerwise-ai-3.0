
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  userRole: 'job_seeker' | 'employer' | 'admin';
  context?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userRole, context }: ChatRequest = await req.json();
    
    console.log(`Processing chatbot request for ${userRole}: ${message}`);
    
    const apiKey = Deno.env.get('GEMINI_BEHAVIORAL_API_KEY');
    
    if (!apiKey) {
      console.error('Missing Gemini API key');
      throw new Error('API key not configured');
    }

    // Create role-specific system prompts
    let systemPrompt = '';
    
    if (userRole === 'job_seeker') {
      systemPrompt = `You are CareerWise AI, a helpful career assistant for job seekers. You help with:

NAVIGATION HELP:
- Dashboard: Main overview with job matches, resume analysis, and career suggestions
- Job Recommendations: Browse personalized job matches based on your profile
- Resume Analyzer: Upload and get AI feedback on your resume (/job-seeker/resume-analyzer)
- Mock Interviews: Practice with AI-powered interviews (/job-seeker/mock-interviews)
- Career Counseling: Get personalized career advice (/job-seeker/career-counseling)  
- Skill Gap Analyzer: Identify skills needed for your target role (/job-seeker/skill-gap-analyzer)
- My Applications: Track your job applications (/job-seeker/my-applications)
- Profile Settings: Update your profile and preferences (/job-seeker/profile-settings)

COMMON QUERIES:
- Resume tips and optimization
- Interview preparation advice
- Career path guidance
- Skill development suggestions
- Job search strategies
- Salary negotiation tips
- Professional networking advice

Always provide helpful, encouraging, and actionable advice. If users ask about navigation, guide them to the appropriate section of the platform.`;
    } else if (userRole === 'employer') {
      systemPrompt = `You are CareerWise AI, a helpful assistant for employers and recruiters. You help with:

NAVIGATION HELP:
- Dashboard: Overview of your job postings and applications
- Job Postings: Create and manage job listings (/employer/job-postings)
- Candidates: Review and manage job applications (/employer/candidates)
- Analytics: View hiring metrics and insights (/employer/analytics)
- Notifications: Manage your hiring alerts (/employer/notifications)
- Settings: Update company profile and preferences (/employer/settings)

COMMON QUERIES:
- Writing effective job descriptions
- Candidate screening best practices
- Interview techniques and questions
- Talent acquisition strategies
- Employer branding tips
- Compensation and benefits guidance
- Legal hiring considerations

Always provide professional, practical advice to help employers find and hire the best talent.`;
    } else {
      systemPrompt = `You are CareerWise AI, an administrative assistant. You help with:

NAVIGATION HELP:
- Admin Dashboard: Overview of platform metrics and user management
- User Management: Manage job seekers and employers
- Analytics: Platform-wide insights and reports
- Settings: System configuration and preferences

COMMON QUERIES:
- Platform usage and metrics
- User support and troubleshooting
- System administration guidance
- Data management and reporting

Provide clear, technical assistance for platform administration.`;
    }

    const prompt = `${systemPrompt}

User Question: "${message}"

Provide a helpful, concise response. If the user is asking about navigation or where to find something, give them specific directions. If it's a general career question, provide actionable advice.

Keep your response conversational, helpful, and under 200 words.`;

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
          maxOutputTokens: 500,
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

    console.log('AI response generated:', generatedText.substring(0, 100) + '...');

    return new Response(JSON.stringify({ 
      response: generatedText,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in careerwise-chatbot function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
