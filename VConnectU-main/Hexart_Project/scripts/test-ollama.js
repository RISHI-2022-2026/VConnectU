
// Use native fetch (Node 18+)
async function checkOllama() {
    try {
        console.log("Checking Ollama connection...");
        const res = await fetch("http://localhost:11434/api/tags");
        if (res.ok) {
            const data = await res.json();
            console.log("Ollama is running.");
            console.log("Available models:", data.models.map(m => m.name));
            return true;
        } else {
            console.error("Ollama responded with status:", res.status);
            return false;
        }
    } catch (e) {
        console.error("Failed to connect to Ollama:", e.message);
        if (e.cause) console.error("Cause:", e.cause);
        return false;
    }
}

checkOllama();
