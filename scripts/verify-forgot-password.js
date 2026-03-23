const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testForgotPassword() {
    const email = "test@example.com"; // Change to an existing user's email if needed
    console.log(`Testing Forgot Password for: ${email}`);

    try {
        // 1. Simulate calling forgot-password API
        // In a real test, we would fetch, but here we can check the DB directly after user tries it in browser
        // OR we can just check if a user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.error("User not found. Please register test@example.com first.");
            return;
        }

        console.log("User found. Current resetToken:", user.resetToken);

        // Let's manually set a token and expiry for testing reset-password
        const token = "test-token-123";
        const expiry = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { email },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry
            }
        });

        console.log("Manual resetToken set for testing reset-password flow.");

        // 2. Simulate calling reset-password API (manually check the logic)
        // We can't easily call our own API route from this script without a running server
        // but we can verify the DB updates.

        console.log("Ready to test. Use token: 'test-token-123' at /reset-password?token=test-token-123");

    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testForgotPassword();
