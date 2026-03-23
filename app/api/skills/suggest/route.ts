import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ChatMistralAI } from '@langchain/mistralai';
import { PromptTemplate } from '@langchain/core/prompts';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentSkills = [], currentGoals = [] } = await request.json();

    const promptText = `You are an expert learning path advisor. Suggest 5 highly relevant, distinct skills the user should learn next based on their current profile.

CURRENT PROFILE:
Known Skills: ${Array.isArray(currentSkills) ? currentSkills.join(', ') : 'None'}
Learning Goals: ${Array.isArray(currentGoals) ? currentGoals.join(', ') : 'None'}

ANALYSIS REQUIREMENTS:
1. Identify skill domains from known skills
2. Suggest skills that complement or build upon existing knowledge
3. Consider career progression and skill synergies
4. Include both foundational and advanced options where appropriate
5. Prioritize skills with high market demand and practical applications

Do NOT suggest skills already present above.

Return ONLY a JSON object with:
{
  "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5"],
  "recommendations": {
    "Skill1": "Specific reason why this skill complements your profile",
    "Skill2": "Specific reason why this skill complements your profile",
    "Skill3": "Specific reason why this skill complements your profile",
    "Skill4": "Specific reason why this skill complements your profile",
    "Skill5": "Specific reason why this skill complements your profile"
  },
  "categories": {
    "Skill1": "category_name",
    "Skill2": "category_name",
    "Skill3": "category_name",
    "Skill4": "category_name",
    "Skill5": "category_name"
  }
}`;

    const mistral = new ChatMistralAI({
      model: 'mistral-small',
      temperature: 0.7,
      apiKey: process.env.MISTRAL_API_KEY,
    });

    const promptTemplate = PromptTemplate.fromTemplate("{promptText}");
    const formattedPrompt = await promptTemplate.format({ promptText });
    
    const response = await mistral.invoke(formattedPrompt);
    const content = response.content;

    if (!content) throw new Error('No content received from Mistral AI');

    let cleanContent = (content as string).replace(/```json\n?|```/g, '').trim();
    if (!cleanContent.startsWith('{')) cleanContent = '{' + cleanContent;
    if (!cleanContent.endsWith('}')) cleanContent = cleanContent + '}';

    const data = JSON.parse(cleanContent);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('POST /api/skills/suggest error', error);
    return NextResponse.json({ error: 'Failed to suggest skills', details: error.message }, { status: 500 });
  }
}
