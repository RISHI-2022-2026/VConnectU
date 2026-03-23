
const fs = require('fs');
const path = require('path');

async function testInterviewSetup() {
    console.log("Testing /api/interview/setup...");

    // Create a dummy resume content
    const formData = new FormData();
    // Simulate a text file upload (since we can't easily fetch a real file in node script without reading fs)
    // In a real browser upload, this would be a File object.
    // For this test, we'll use the fallback 'resumeContent' or try to mock a File if the API supports it.

    // The current API implementation checks for `formData.get("resume")` as a File. 
    // Node.js implementation of FormData might not be exactly 1:1 with Browser for File objects, 
    // but let's try to simulate what we can. 

    // Actually, looking at the code: `const file = formData.get("resume") as File | null;`
    // If we send a Blob with a name, it might work as a File in Node 18+ fetch.

    const resumeText = `
    John Doe
    Software Engineer
    
    Skills: JavaScript, React, Node.js, Python, SQL, AWS.
    
    Experience:
    - Senior Developer at Tech Co (2020-Present): Built scalable web apps using Next.js.
    - Junior Developer at StartUp Inc (2018-2020): Worked on backend API with Express.
    `;

    const blob = new Blob([resumeText], { type: 'text/plain' });
    formData.append("resume", blob, "resume.txt");

    try {
        // We need to hit the running server or mocking the handler? 
        // This script is running in isolation, so we can't easily hit "localhost:3000" if it's not running, 
        // OR we can just import the handler if we transpile it. 
        // But importing Next.js route handlers in a raw node script is hard due to imports.
        // So we will assume the server is running on 3000 (which it is, per user metadata).

        const res = await fetch("http://localhost:3000/api/interview/setup", {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            console.log("✅ Success! API Response:", JSON.stringify(data, null, 2));

            if (data.techQuestions && data.techQuestions.length > 0) {
                console.log("✅ Tech questions generated.");
            } else {
                console.warn("⚠️ No tech questions found.");
            }

            if (data.detectedSkills && data.detectedSkills.length > 0) {
                console.log("✅ Skills detected:", data.detectedSkills);
            } else {
                console.warn("⚠️ No skills detected.");
            }
        } else {
            console.error("❌ API Failed:", res.status, res.statusText);
            const text = await res.text();
            console.error("Response:", text);
        }

    } catch (err) {
        console.error("❌ Test Script Error:", err);
    }
}

async function testInterviewFeedback() {
    console.log("\nTesting /api/interview/feedback...");

    const payload = {
        answers: [
            { question: "What is React?", answer: "React is a JavaScript library for building user interfaces." },
            { question: "Explain Closure.", answer: "A closure is the combination of a function bundled together with references to its surrounding state." }
        ],
        duration: 120
    };

    try {
        const res = await fetch("http://localhost:3000/api/interview/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const data = await res.json();
            console.log("✅ Success! Feedback Response:", JSON.stringify(data, null, 2));

            if (data.clarityScore && data.confidenceScore) {
                console.log("✅ Scores received.");
            } else {
                console.warn("⚠️ Scores missing.");
            }
        } else {
            console.error("❌ Feedback API Failed:", res.status, res.statusText);
            const text = await res.text();
            console.error("Response:", text);
        }

    } catch (err) {
        console.error("❌ Feedback Test Error:", err);
    }
}

async function runTests() {
    await testInterviewSetup();
    await testInterviewFeedback();
}

runTests();
