const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Updating SSC job deadline...");

        // Find the SSC job
        const job = await prisma.job.findFirst({
            where: {
                title: "SSC GD Constable (General Duty)"
            }
        });

        if (job) {
            await prisma.job.update({
                where: { id: job.id },
                data: {
                    deadline: new Date("2026-01-31T23:59:59Z")
                }
            });
            console.log("Successfully updated SSC job deadline to 2026-01-31");
        } else {
            console.log("SSC Job not found!");
        }

    } catch (e) {
        console.error("Error updating job:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
