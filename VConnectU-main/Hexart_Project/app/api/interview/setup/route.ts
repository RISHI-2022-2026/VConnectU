import { NextResponse } from "next/server";
import { generateOllamaResponse } from "@/lib/ollama";
import { SKILL_QUESTIONS, HR_QUESTIONS } from "@/lib/interviewData";
// import pdf from "pdf-parse"; // Importing dynamically to avoid build issues if server-side only

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("resume") as File | null;
        let resumeText = "";

        if (file) {
            // Buffer extraction for PDF parsing
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            try {
                if (file.name.toLowerCase().endsWith('.docx')) {
                    const mammoth = await import("mammoth");
                    const result = await mammoth.extractRawText({ buffer: buffer });
                    resumeText = result.value;
                } else {
                    const { createRequire } = await import('module');
                    const require = createRequire(import.meta.url);
                    const pdf = require('pdf-parse');
                    // @ts-ignore
                    const data = await pdf(buffer);
                    resumeText = data.text;
                }
            } catch (err) {
                console.error("File Parse Error:", err);
                // Fallback to text decode if parse fails (e.g. plain text file)
                resumeText = buffer.toString('utf-8').slice(0, 3000);
            }
        } else {
            // Fallback if just text sent
            resumeText = (formData.get("resumeContent") as string) || "";
        }

        const systemPrompt = `You are an expert technical and HR interviewer.
        Analyze the candidate's resume content provided below and generate:
        1. 4 Technical Interview Questions: Deeply tailored to the specific skills, frameworks, and projects mentioned.
        2. 4 HR/Behavioral Questions: Tailored to the candidate's experience, career path, or background (e.g., if they mention a specific company, ask about their role there).
        3. Extract the top 3-5 technical skills detected.
        
        Format the output EXCLUSIVELY as JSON:
        {
          "techQuestions": ["Question string 1", "Question string 2", "Question string 3", "Question string 4"],
          "hrQuestions": ["HR Question 1", "HR Question 2", "HR Question 3", "HR Question 4"],
          "detectedSkills": ["Skill1", "Skill2", "Skill3"]
        }
        IMPORTANT: Return ONLY the JSON object. No conversational text.`;

        try {
            const aiResponse = await generateOllamaResponse(
                `Resume Content: ${resumeText.slice(0, 3000)}...`,
                systemPrompt
            );

            // Attempt to parse JSON from AI response
            // Find JSON block if AI adds extra text
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            const parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

            if (parsedData && parsedData.techQuestions && parsedData.hrQuestions && parsedData.detectedSkills) {
                return NextResponse.json({
                    techQuestions: parsedData.techQuestions,
                    hrQuestions: parsedData.hrQuestions,
                    detectedSkills: parsedData.detectedSkills
                });
            }
            throw new Error("Missing required fields in AI JSON");

        } catch (ollamaError) {
            console.error("Ollama Interview Gen Failed:", ollamaError);
            // FALLBACK TO EXISTING LOGIC
            const textToScan = resumeText.toLowerCase() || (file?.name || "").toLowerCase();
            const detectedSkills: string[] = [];
            const techQuestions: string[] = [];

            Object.keys(SKILL_QUESTIONS).forEach(skill => {
                if (skill !== "general" && textToScan.includes(skill)) {
                    detectedSkills.push(skill);
                }
            });

            if (detectedSkills.length > 0) {
                detectedSkills.forEach(skill => {
                    techQuestions.push(...SKILL_QUESTIONS[skill]);
                });
            }
            techQuestions.push(...SKILL_QUESTIONS["general"]);

            const shuffledTech = techQuestions.sort(() => 0.5 - Math.random()).slice(0, 4);
            const shuffledHR = [...HR_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 4);

            return NextResponse.json({
                techQuestions: shuffledTech,
                hrQuestions: shuffledHR,
                detectedSkills
            });
        }

    } catch (error) {
        console.error("Interview API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate questions" },
            { status: 500 }
        );
    }
}
