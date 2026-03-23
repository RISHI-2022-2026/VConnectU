const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Updating RRB job details...");

        // Find the RRB job
        const job = await prisma.job.findFirst({
            where: {
                title: "Track Maintainer Grade-IV (Group D)"
            }
        });

        if (job) {
            await prisma.job.update({
                where: { id: job.id },
                data: {
                    deadline: new Date("2026-02-28T23:59:59Z"),
                    selectionProcessString: "Computer Based Test (CBT), Physical Efficiency Test (PET), Document Verification, Medical Examination",
                    examDate: new Date("2026-05-15T10:00:00Z"),
                    examMode: "Online (CBT)",
                }
            });
            console.log("Successfully updated RRB job details.");
        } else {
            console.log("RRB Job not found!");
        }

    } catch (e) {
        console.error("Error updating job:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
