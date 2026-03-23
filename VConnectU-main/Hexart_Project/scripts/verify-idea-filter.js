const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyIdeaFiltering() {
    console.log("Verifying Idea Filtering...");

    try {
        // 1. Get or create a test user
        let userA = await prisma.user.findUnique({ where: { email: "userA@example.com" } });
        if (!userA) {
            userA = await prisma.user.create({
                data: {
                    email: "userA@example.com",
                    name: "User A",
                    password: "password123",
                    role: "USER"
                }
            });
        }

        // 2. Get or create an HR user
        let hrUser = await prisma.user.findUnique({ where: { email: "hr@example.com" } });
        if (!hrUser) {
            hrUser = await prisma.user.create({
                data: {
                    email: "hr@example.com",
                    name: "HR User",
                    password: "password123",
                    role: "HR"
                }
            });
        }

        // 3. User A uploads an idea
        const idea = await prisma.idea.create({
            data: {
                title: "Test Filtering Idea",
                problem: "Filter testing",
                solution: "Hide from owner",
                technologies: "Test",
                impact: "High",
                contactEmail: "userA@example.com",
                contactPhone: "1234567890",
                userId: userA.id
            }
        });

        console.log(`Created Idea ID: ${idea.id} for User A`);

        // 4. Simulate API fetch logic for User A (NOT HR)
        const ideasForUserA = await prisma.idea.findMany({
            where: {
                AND: [
                    { title: { contains: "" } },
                    { userId: { not: userA.id } }
                ]
            }
        });

        const foundUserAIdeaForA = ideasForUserA.find(i => i.id === idea.id);
        console.log(`User A sees own idea in filtered results: ${!!foundUserAIdeaForA} (Expected: false)`);

        // 5. Simulate API fetch logic for HR User
        const ideasForHR = await prisma.idea.findMany({
            where: {
                title: { contains: "" }
            }
        });

        const foundUserAIdeaForHR = ideasForHR.find(i => i.id === idea.id);
        console.log(`HR User sees User A's idea in results: ${!!foundUserAIdeaForHR} (Expected: true)`);

        if (!foundUserAIdeaForA && foundUserAIdeaForHR) {
            console.log("SUCCESS: Idea filtering works as expected!");
        } else {
            console.error("FAILURE: Idea filtering logic is incorrect.");
        }

    } catch (error) {
        console.error("Verification error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyIdeaFiltering();
