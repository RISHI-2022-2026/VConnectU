import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

async function openRouterChatCompletions({ model, messages, max_tokens = 2048, temperature = 0.7, seed }: any) {
  const baseUrl = process.env.LLAMA_API_URL || 'https://openrouter.ai/api/v1';
  const apiKey = process.env.LLAMA_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('Missing OpenRouter API key in backend environment');

  const referer = process.env.OPENROUTER_HTTP_REFERER || 'http://localhost:3000';
  const title = process.env.OPENROUTER_APP_TITLE || 'SkillVouch AI';

  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': referer,
      'X-Title': title,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens,
      temperature,
      ...(typeof seed === 'number' ? { seed } : {}),
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`OpenRouter error: ${resp.status} ${resp.statusText}${text ? ` - ${text}` : ''}`);
  }
  return resp.json();
}

function parseJsonFromModelContent(content: string) {
  if (!content) throw new Error('Empty model response');
  const cleaned = content.replace(/```json\n?|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Check for array
    const firstArray = cleaned.indexOf('[');
    const lastArray = cleaned.lastIndexOf(']');
    if (firstArray !== -1 && lastArray !== -1 && lastArray > firstArray) {
      const slice = cleaned.slice(firstArray, lastArray + 1);
      try { return JSON.parse(slice); } catch {}
    }

    // Check for object
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const slice = cleaned.slice(firstBrace, lastBrace + 1);
      try { return JSON.parse(slice); } catch {}
    }

    throw new Error('Failed to parse JSON from model response');
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skillName } = await request.json();

    if (!skillName) return NextResponse.json({ error: 'skillName is required' }, { status: 400 });

    const prompt = `Create a 5-step detailed learning roadmap for mastering "${skillName}".
    
Return ONLY a JSON object. The object must have:
- skill (string)
- level (string, e.g. "Beginner")
- duration (string, e.g. "3-4 months")
- roadmap (array of steps)

Each step in the "roadmap" array must have:
- step (number)
- title (string)
- description (string)
- duration (string)
- topics (array of strings)
- resources (array of objects with fields: type (one of "documentation", "tutorial", "practice"), title (string), url (string), searchQuery (string))
- projects (array of strings)

CRITICAL RULES FOR RESOURCES:
1. "searchQuery" is MANDATORY. It should be a specific YouTube search query like "Basics with Babish knife skills" or "Programming with Mosh Python tutorial".
2. If providing a "url", it MUST be a real, high-quality link. 
3. TRUSTED SOURCES for tutorials: YouTube channels (Basics with Babish, Chef John, Joshua Weissman, freeCodeCamp, Programming with Mosh, Traversy Media, The Net Ninja).
4. TRUSTED SOURCES for documentation: Official docs, MDN Web Docs, Serious Eats (for cooking), Wikipedia.
5. NEVER use "example.com" or common dead links.

JSON object only. No markdown.`;

    let content;
    
    if (process.env.LLAMA_API_KEY || process.env.VITE_OPENROUTER_API_KEY) {
      console.log('Generating roadmap using OpenRouter...');
      const data = await openRouterChatCompletions({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          { role: 'system', content: 'You generate learning roadmaps. Output strict JSON only.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1400,
        temperature: 0.7,
      });
      content = data?.choices?.[0]?.message?.content;
    } else if (process.env.MISTRAL_API_KEY) {
        console.log('Generating roadmap using Mistral (fallback)...');
        // Lazy load Mistral client would be better but for now we fetch directly if possible or use a local helper
        // Since we already have Mistral logic in other files, let's just use fetch to Mistral directly here or similar
        // Actually, let's just import the Mistral logic if available
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: 'mistral-small-latest',
                messages: [
                    { role: 'system', content: 'You generate learning roadmaps. Output strict JSON only.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            })
        });
        const data = await response.json();
        content = data?.choices?.[0]?.message?.content;
    } else {
        throw new Error('No AI API keys configured (Mistral or OpenRouter)');
    }
    const roadmapData = parseJsonFromModelContent(content);
    if (!roadmapData.roadmap || !Array.isArray(roadmapData.roadmap)) throw new Error('Model did not return a valid roadmap structure');

    return NextResponse.json(roadmapData);

  } catch (error: any) {
    console.error('Roadmap generation error:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap', details: error.message }, { status: 500 });
  }
}
