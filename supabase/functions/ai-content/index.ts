import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, topic, keyword, title, outline, domain } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "You are an expert SEO content strategist. Always respond with valid JSON.";
    let userPrompt = "";

    const brandContext = domain ? `Brand: ${domain.name}. Tone: ${domain.tone || 'professional'}. Audience: ${domain.target_audience || 'business professionals'}.` : "";

    if (type === 'keywords') {
      userPrompt = `${brandContext}
Generate 6 keyword suggestions for the topic: "${topic}".
Return JSON: { "keywords": [{ "keyword": "string", "source": "ai" or "google_suggest", "intent": "informational" or "transactional" or "commercial", "difficulty": "low" or "medium" or "high", "reasoning": "brief explanation" }] }`;
    } else if (type === 'titles') {
      userPrompt = `${brandContext}
Generate 4 SEO-optimized title variants for keyword: "${keyword}".
Return JSON: { "titles": [{ "title": "string", "type": "seo" or "aeo" or "geo" or "conversion", "score": 1-100, "reasoning": "why this works" }] }`;
    } else if (type === 'outline') {
      userPrompt = `${brandContext}
Create a detailed blog outline for: "${title}" targeting keyword: "${keyword}".
Return JSON: { "outline": [{ "heading": "string", "level": "h2" or "h3", "points": ["key point 1", "key point 2"] }] }`;
    } else if (type === 'content') {
      userPrompt = `${brandContext}
Write a comprehensive blog post for: "${title}".
Keyword: "${keyword}".
Outline: ${JSON.stringify(outline)}.
Write 1500+ words. Use markdown formatting.
Return JSON: { "content": "full markdown content", "seoScores": { "overall": 85, "readability": 80, "keyword_density": 75, "structure": 90, "meta_quality": 80, "suggestions": ["suggestion 1"] } }`;
    }

    console.log(`AI Content request - Type: ${type}, Topic: ${topic || keyword || title}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Failed to parse AI response");
  } catch (error) {
    console.error("AI content error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
