const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Updating SSC job details...");

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
                    selectionProcessString: "Computer Based Examination (CBE), Physical Efficiency Test (PET), Physical Standard Test (PST), Medical Examination",
                    examDate: new Date("2026-03-01T10:00:00Z"), // Hypothetical date
                    examMode: "Online (CBE)",
                }
            });
            console.log("Successfully updated SSC job details.");
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
