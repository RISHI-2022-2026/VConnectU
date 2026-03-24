const http = require('http');

const queries = [
    "How can I find a job?",
    "Tell me about mock interviews",
    "How do I update my resume?",
    "What is VConnectU x Skillvouch AI?",
    "Hello bot"
];

function testChat(message) {
    const data = JSON.stringify({ message });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/chat',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`Query: "${message}"`);
            console.log(`Response: ${JSON.parse(body).response}`);
            console.log('---');
        });
    });

    req.on('error', (error) => {
        console.error(`Error for "${message}":`, error);
    });

    req.write(data);
    req.end();
}

console.log("Testing Chatbot API...");
queries.forEach((q, i) => {
    setTimeout(() => testChat(q), i * 1500); // Stagger requests
});
