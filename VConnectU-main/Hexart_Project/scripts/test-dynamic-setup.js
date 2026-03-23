async function testSetup(resumeContent) {
    try {
        console.log(`\nTesting with resume: "${resumeContent.slice(0, 50)}..."`);

        const formData = new FormData();
        formData.append('resumeContent', resumeContent);

        const response = await fetch('http://localhost:3000/api/interview/setup', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Response received:');
            console.log('Detected Skills:', data.detectedSkills);
            console.log('Tech Questions:', data.techQuestions);
            console.log('HR Questions:', data.hrQuestions);
        } else {
            console.error('❌ Error response:', data);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function runTests() {
    const frontendResume = "Experience in React, Tailwind CSS, and TypeScript. Built a dashboard for e-commerce.";
    const backendResume = "Expertise in Node.js, Express, and PostgreSQL. Focused on scalability and database optimization.";

    await testSetup(frontendResume);
    await testSetup(backendResume);
}

runTests();
