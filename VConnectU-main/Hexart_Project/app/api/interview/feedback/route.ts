
import { NextResponse } from "next/server";
import { generateOllamaResponse } from "@/lib/ollama";

export async function POST(req: Request) {
    try {
        const { answers, duration } = await req.json();

        if (!answers || answers.length === 0) {
            return NextResponse.json({
                clarityScore: 0,
                confidenceScore: 0,
                missingPoints: ["No answers were recorded."],
                overallFeedback: "The interview was submitted without any recorded answers. Please ensure your microphone is working and you are speaking during the session."
            });
        }

        // Check if all answers are virtually empty
        const totalCharCount = answers.reduce((acc: number, a: any) => acc + (a.answer || "").length, 0);
        if (totalCharCount < 10) {
            return NextResponse.json({
                clarityScore: 10,
                confidenceScore: 5,
                missingPoints: ["Answers were too short or empty.", "Voice was not captured clearly."],
                overallFeedback: "It seems like your answers were not captured. Please try speaking louder or check your microphone settings."
            });
        }

        // format answers for the prompt
        const answerSummary = answers.map((a: any, i: number) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`).join('\n\n');

        const systemPrompt = `You are a STRICT and honest technical and HR interview coach.
        The candidate has completed an interview. Here are their answers captured via speech-to-text:
        
        ${answerSummary}
        
        CRITICAL EVALUATION RULES:
        1. If an answer is "undefined", empty, or nonsense, GIVE A SCORE OF 0 for that question.
        2. DO NOT pretend the candidate said something they didn't. 
        3. If the total quality is poor, the scores MUST be low (below 30%).
        4. Be honest and critical. If they did well, give a good score, but if they failed to provide substance, the score must reflect that.
        5. Clarity score should reflect how well the thought was articulated.
        6. Confidence score should reflect the flow and length of the answer.
        
        Format as JSON:
        {
           "clarityScore": number (0-100),
           "confidenceScore": number (0-100),
           "missingPoints": [
              "Specific criticism or missing point 1", 
              "Specific criticism or missing point 2"
           ],
           "overallFeedback": "Honest performance summary"
        }
        IMPORTANT: Only return the JSON. No conversational text.`;

        const aiResponse = await generateOllamaResponse(
            "Perform a strict evaluation of the interview answers provided.",
            systemPrompt
        );

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        if (!parsedData) throw new Error("Invalid AI Feedback Response");

        return NextResponse.json(parsedData);

    } catch (error) {
        console.error("Feedback API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate feedback" },
            { status: 500 }
        );
    }
}
