
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting to database...");
        const userCount = await prisma.user.count();
        console.log("Connection successful!");
        console.log("User count:", userCount);
    } catch (e) {
        console.error("DB Error:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
