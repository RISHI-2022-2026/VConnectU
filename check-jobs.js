const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const jobCount = await prisma.job.count();
        console.log(`Total Jobs: ${jobCount}`);

        const jobs = await prisma.job.findMany();
        console.log("Jobs:", JSON.stringify(jobs, null, 2));

        const users = await prisma.user.findMany({
            include: {
                qualification: true
            }
        });
        // users might not have qualification relation loaded if it's just a field, checking schema...
        // In schema, 'qualification' is a field of type QualificationLevel enum.
        console.log("Users:", JSON.stringify(users, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
