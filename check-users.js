const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        console.log(`User count: ${userCount}`);
        
        const users = await prisma.user.findMany({
            select: {
                name: true,
                email: true,
                createdAt: true
            },
            take: 5
        });
        
        console.log("Recent users:", JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Error checking database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
