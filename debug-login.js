
// Native fetch assumed
// If node is old, we valid minimal version. Node 18+ has fetch.
// Let's use generic http to be safe or just try fetch. Assuming Node 18+.

async function run() {
    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "jaya123@gmail.com",
                password: "password" // using dummy password, just want to see if we get JSON or HTML
            })
        });

        const contentType = response.headers.get("content-type");
        console.log("Status:", response.status);
        console.log("Content-Type:", contentType);

        const text = await response.text();
        console.log("Body length:", text.length);
        const fs = require('fs');
        fs.writeFileSync('api-error.html', text);
        console.log("Saved error to api-error.html");
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
