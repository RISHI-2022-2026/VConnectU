
const fs = require('fs');
const path = require('path');

async function testUpload() {
    // Create a dummy PDF file (just a text file really, but we'll try to pass it)
    // Or better, let's try to upload a simple text file first if the API supports it
    // The API expects 'resume' field.

    // We need 'form-data' library or similar to simulate multipart upload in node
    // Since we might not have it, we'll try to use the native fetch with a constructed body if possible, 
    // or just assume standard boundary handling.
    // Actually, simpler: we can use a small python script or curl if available, but let's try node with a boundary.

    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const content = 'This is a test resume content for a software engineer.';

    // Construct valid multipart body
    const body =
        `--${boundary}\r
Content-Disposition: form-data; name="resume"; filename="test.pdf"\r
Content-Type: application/pdf\r
\r
${content}\r
--${boundary}--\r
`;

    try {
        console.log("Sending Upload Request...");
        const res = await fetch("http://localhost:3000/api/resume/analyze", {
            method: "POST",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${boundary}`
            },
            body: body
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Upload Failed:", e);
    }
}

testUpload();
