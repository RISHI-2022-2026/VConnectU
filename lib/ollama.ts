
export const OLLAMA_BASE_URL = "http://127.0.0.1:11434/api";
export const DEFAULT_MODEL = "llama3.2:1b";

export interface OllamaResponse {
    response: string;
    context?: number[];
    done: boolean;
}

export async function generateOllamaResponse(
    prompt: string,
    systemPrompt?: string,
    model: string = DEFAULT_MODEL
): Promise<string> {
    try {
        const payload = {
            model,
            prompt,
            system: systemPrompt,
            stream: false
        };

        console.log(`Sending request to Ollama: ${OLLAMA_BASE_URL}/generate`, { model });

        const res = await fetch(`${OLLAMA_BASE_URL}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            console.error(`Ollama API Error: ${res.status} ${res.statusText}`);
            const errorText = await res.text();
            console.error(`Ollama Error Body: ${errorText}`);
            throw new Error(`Ollama API returned ${res.status}: ${errorText}`);
        }

        const data = (await res.json()) as OllamaResponse;
        return data.response;

    } catch (error: any) {
        console.error("Failed to generate response from Ollama:", error);

        if (error.cause && (error.cause.code === 'ECONNREFUSED' || error.cause.code === 'ECONNRESET')) {
            throw new Error(`Ollama service is not reachable at ${OLLAMA_BASE_URL}. Is it running? (Error: ${error.message})`);
        }

        throw error;
    }
}
