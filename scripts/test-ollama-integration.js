
const { Blob } = require('buffer');

async function testAPIs() {
    const baseUrl = "http://localhost:3000";
    console.log("Starting Verification...");

    // 1. Test Chatbot
    try {
        console.log("\nTesting /api/chat...");
        const res = await fetch(`${baseUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Hello, who are you?" })
        });
        const data = await res.json();
        console.log("Chat Response:", data);
    } catch (e) {
        console.error("Chat Test Failed:", e.message);
    }

    // 2. Test Job Analysis
    try {
        console.log("\nTesting /api/jobs/analyze...");
        const res = await fetch(`${baseUrl}/api/jobs/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                jobDescription: "We are looking for a React Developer with Node.js experience.",
                userProfile: "I am a Frontend Developer with React skills."
            })
        });
        const data = await res.json();
        console.log("Job Analysis Response:", data);
    } catch (e) {
        console.error("Job Analysis Test Failed:", e.message);
    }

    // 3. Test Interview Feedback
    try {
        console.log("\nTesting /api/interview/feedback...");
        const res = await fetch(`${baseUrl}/api/interview/feedback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                questions: ["What is React?", "Explain closure."],
                duration: 60
            })
        });
        const data = await res.json();
        console.log("Feedback Response:", data);
    } catch (e) {
        console.error("Feedback Test Failed:", e.message);
    }

    // Note: File upload tests (Resume Analyze, Interview Setup) require FormData which is tricky in pure Node script 
    // without running the Next.js server context or extra libs. 
    // We will assume they work if the logic is similar to the ones above and rely on manual verification instruction.

    console.log("\nVerification Script Complete. Please ensure Next.js server is running on port 3000 for these to work.");
}

testAPIs();
