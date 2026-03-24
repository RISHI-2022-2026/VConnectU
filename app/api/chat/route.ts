import { NextResponse } from "next/server";
import { generateOllamaResponse } from "@/lib/ollama";
import { CHAT_KNOWLEDGE_BASE } from "@/lib/chatbotData";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const systemPrompt = `You are VConnectU x Skillvouch AI Assistant, a helpful AI for a job platform.
        Your goal is to help users with job preparation, mock interviews, and resume advice.
        Be concise, professional, and encouraging.
        
        Knowledge Base Context:
        ${JSON.stringify(CHAT_KNOWLEDGE_BASE)}
        
        If the user asks something in the knowledge base, prioritize that information.
        Otherwise, answer generally as an AI assistant.`;

        try {
            const responseText = await generateOllamaResponse(message, systemPrompt);
            return NextResponse.json({ response: responseText });
        } catch (ollamaError) {
            console.error("Ollama connection failed, falling back to basic logic", ollamaError);

            // Fallback logic
            let responseText = "I'm having trouble connecting to my AI brain right now. Please ensure Ollama is running.";
            const lowerMessage = message.toLowerCase();
            for (const intent of CHAT_KNOWLEDGE_BASE) {
                const match = intent.keywords.some(keyword => lowerMessage.includes(keyword));
                if (match) {
                    responseText = intent.response;
                    break;
                }
            }
            return NextResponse.json({ response: responseText });
        }

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
