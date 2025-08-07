
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoadmapRequest {
  careerTitle: string;
  userSkills?: string[];
  experienceLevel?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { careerTitle, userSkills = [], experienceLevel = 'intermediate' }: RoadmapRequest = await req.json();
    
    console.log(`Generating roadmap for: ${careerTitle}`);
    
    const apiKey = Deno.env.get('GEMINI_SYSTEM_DESIGN_API_KEY');
    
    if (!apiKey) {
      console.error('Missing Gemini API key');
      throw new Error('API key not configured');
    }

    const prompt = `You are a career counseling expert. Create a detailed learning roadmap for someone pursuing a career as "${careerTitle}".

Current user details:
- Experience level: ${experienceLevel}
- Current skills: ${userSkills.length > 0 ? userSkills.join(', ') : 'Not specified'}

Please provide a comprehensive roadmap with the following structure:

1. **Learning Path Overview** - Brief description of the journey ahead
2. **Phase 1: Foundation (0-3 months)** - Basic skills and concepts to master first
3. **Phase 2: Intermediate (3-6 months)** - Building on the foundation
4. **Phase 3: Advanced (6-12 months)** - Specialized skills and real-world application
5. **Phase 4: Expert (12+ months)** - Advanced topics and leadership skills
6. **Key Certifications** - Important certifications to pursue
7. **Practical Projects** - Hands-on projects to build portfolio
8. **Resources** - Books, courses, websites, and tools

Format your response as JSON with this structure:
{
  "overview": "Brief overview text",
  "phases": [
    {
      "title": "Phase name",
      "duration": "Time estimate",
      "description": "What to focus on",
      "skills": ["skill1", "skill2"],
      "resources": ["resource1", "resource2"]
    }
  ],
  "certifications": ["cert1", "cert2"],
  "projects": ["project1", "project2"],
  "resources": {
    "books": ["book1", "book2"],
    "courses": ["course1", "course2"],
    "websites": ["site1", "site2"],
    "tools": ["tool1", "tool2"]
  }
}

Make it specific to ${careerTitle} and practical for someone at ${experienceLevel} level.`;

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
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
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

    console.log('Generated roadmap received');

    // Try to parse as JSON, fallback to structured text if needed
    let result;
    try {
      const cleanText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleanText);
    } catch (parseError) {
      console.warn('Failed to parse as JSON, returning structured fallback:', parseError);
      
      // Create a structured fallback response
      result = {
        overview: "A comprehensive learning roadmap has been generated for your career path.",
        phases: [
          {
            title: "Foundation Phase",
            duration: "0-3 months",
            description: "Building fundamental skills and understanding core concepts.",
            skills: ["Basic concepts", "Fundamental tools"],
            resources: ["Online tutorials", "Documentation"]
          }
        ],
        certifications: ["Industry-standard certifications"],
        projects: ["Beginner projects", "Portfolio development"],
        resources: {
          books: ["Industry-recommended books"],
          courses: ["Online courses"],
          websites: ["Official documentation"],
          tools: ["Essential tools"]
        },
        rawContent: generatedText
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-career-roadmap function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
