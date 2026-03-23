
import { NextResponse } from "next/server";
import { generateOllamaResponse } from "@/lib/ollama";

export async function POST(req: Request) {
    try {
        const { jobDescription, userProfile } = await req.json();

        if (!jobDescription) {
            return NextResponse.json({ error: "Job description required" }, { status: 400 });
        }

        const systemPrompt = `You are a career counselor.
        Analyze the Job Description against the User Profile (if provided).
        Provide a "Match Confidence" percentage and a brief 2-sentence summary of why they are a good fit or what is missing.
        
        Format as JSON:
        {
           "matchScore": 85,
           "summary": "You have the required React skills, but lack AWS experience mentioned."
        }`;

        const prompt = `Job Description: ${jobDescription.slice(0, 1000)}...
        
        User Profile Summary: ${userProfile || "Not provided"}`;

        const aiResponse = await generateOllamaResponse(prompt, systemPrompt);

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        return NextResponse.json(parsedData || { matchScore: 0, summary: "Could not analyze." });

    } catch (error: any) {
        console.error("Job Analysis Error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to analyze job",
                details: String(error)
            },
            { status: 500 }
        );
    }
}
