
import { NextResponse } from "next/server";
import { generateOllamaResponse } from "@/lib/ollama";

function parseJsonFromModelContent(content: string) {
    if (!content) throw new Error('Empty model response');
    const cleaned = content.replace(/```json\n?|```/g, '').trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const slice = cleaned.slice(firstBrace, lastBrace + 1);
            return JSON.parse(slice);
        }
        throw new Error('Failed to parse JSON from model response');
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("resume") as File | null;
        let resumeText = "";

        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const fileName = file.name.toLowerCase();

            try {
                if (fileName.endsWith('.docx')) {
                    // @ts-ignore
                    const mammoth = await import("mammoth");
                    const result = await mammoth.extractRawText({ buffer: buffer });
                    resumeText = result.value;
                } else if (fileName.endsWith('.pdf')) {
                    const { createRequire } = await import('module');
                    const require = createRequire(import.meta.url);
                    const pdf = require('pdf-parse');
                    // @ts-ignore
                    const data = await pdf(buffer);
                    resumeText = data.text;
                } else {
                    // Fallback to plain text
                    resumeText = buffer.toString('utf-8');
                }
            } catch (err: any) {
                console.error("File Parse Error:", err);
                return NextResponse.json({
                    error: "Failed to read file content.",
                    details: err.message
                }, { status: 400 });
            }
        } else {
            return NextResponse.json({ error: "No resume file provided" }, { status: 400 });
        }

        const systemPrompt = `You are a professional resume reviewer and ATS (Applicant Tracking System) expert.
        Analyze the provided resume text.
        Provide:
        1. A score out of 100 based on ATS compatibility, clarity, and impact.
        2. Identify missing keywords (specific tech skills or industry-standard terms missing from this resume).
        3. Suggest job roles specifically categorized into:
           - "software": Roles in IT/Software companies.
           - "nonIT": Roles in non-technical sectors.
           - "private": Non-IT private sector roles.
           - "government": Relevant government sector roles or exams.
        4. Provide clear, actionable improvement tips with explanations.
        5. Check for common formatting issues.
        
        Format the output strictly as JSON:
        {
          "score": 85,
          "missingKeywords": ["Skill1", "Skill2"],
          "suggestedRoles": {
            "software": ["Role 1", "Role 2"],
            "nonIT": ["Role 3"],
            "private": ["Role 4"],
            "government": ["Role 5"]
          },
          "improvementTips": [
             { "tip": "Bold Action Verbs", "explanation": "Starting bullet points with strong action verbs like 'Spearheaded' or 'Optimized' makes your achievements stand out to hiring managers." }
          ],
          "formattingChecks": [
             { "label": "File Format", "passed": true },
             { "label": "Contact Info", "passed": true }
          ]
        }
        Only return the JSON. No other text.`;

        const aiResponse = await generateOllamaResponse(
            `Resume Content (First 4000 chars): ${resumeText.slice(0, 4000)}`,
            systemPrompt
        );

        const parsedData = parseJsonFromModelContent(aiResponse);

        if (!parsedData) throw new Error("Invalid AI Response: " + aiResponse.substring(0, 100));

        return NextResponse.json(parsedData);

    } catch (error: any) {
        console.error("Resume Analysis Error:", error);

        // Check if it's an Ollama connection error - fallback to mock for demo
        const isOllamaError = error.message?.includes("Ollama service is not reachable") ||
            (error.cause && (error.cause.code === 'ECONNREFUSED' || error.cause.code === 'ECONNRESET'));

        if (isOllamaError) {
            console.warn("Ollama not running. Falling back to mock data for demonstration.");
            return NextResponse.json({
                score: 85,
                missingKeywords: ["Docker", "Kubernetes", "Redis", "System Design"],
                suggestedRoles: {
                    software: ["Full Stack Developer", "Backend Engineer", "DevOps Trainee"],
                    nonIT: ["Technical Content Writer", "Project Coordinator"],
                    private: ["System Administrator", "IT Consultant"],
                    government: ["NIC Scientist-B", "PSU Engineer", "SSC CGL (Technical)"]
                },
                improvementTips: [
                    {
                        "tip": "Quantify Achievements",
                        "explanation": "Use numbers to show impact. Instead of 'Improved performance', use 'Boosted system performance by 30% through caching optimization'."
                    },
                    {
                        "tip": "Add a Professional Summary",
                        "explanation": "A 2-3 sentence summary at the top can help recruiters quickly understand your value proposition and career goals."
                    },
                    {
                        "tip": "Tailor for ATS",
                        "explanation": "Ensure skills like 'Docker' and 'Kubernetes' are explicitly mentioned if applying for cloud roles, as ATS filters for these keywords."
                    }
                ],
                formattingChecks: [
                    { "label": "File Format (PDF/DOCX)", "passed": true },
                    { "label": "Contact Information Detected", "passed": true },
                    { "label": "Section Headings Clarity", "passed": true },
                    { "label": "Date Formatting Consistency", "passed": true },
                    { "label": "Action Verbs Usage", "passed": false, "issue": "Use more strong verbs like 'Spearheaded', 'Optimized'" }
                ]
            });
        }

        return NextResponse.json(
            {
                error: error.message || "Failed to analyze resume",
                details: error.message || String(error),
                stack: error.stack
            },
            { status: 500 }
        );
    }
}
