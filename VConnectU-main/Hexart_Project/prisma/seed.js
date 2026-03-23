const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding jobs...");
    const count = await prisma.job.count();
    if (count > 0) {
        console.log("Jobs already exist. Skipping.");
        return;
    }

    await prisma.job.createMany({
        data: [
            // 10th Jobs
            { title: "Office Assistant", company: "Govt of India", location: "Delhi", salary: "15,000/mo", type: "Full-time", category: "Government", minQualification: "TENTH", description: "Clerical work." },
            { title: "Field Agent", company: "Private Corp", location: "Mumbai", salary: "12,000/mo", type: "Part-time", category: "Private", minQualification: "TENTH", description: "Field sales." },

            // 12th Jobs
            { title: "Junior Clerk", company: "State Govt", location: "Pune", salary: "20,000/mo", type: "Full-time", category: "Government", minQualification: "TWELFTH", description: "Data entry." },
            { title: "Support Associate", company: "Tech Support", location: "Remote", salary: "18,000/mo", type: "Full-time", category: "Private", minQualification: "TWELFTH", description: "Customer support." },

            // UG Jobs
            { title: "Software Engineer", company: "Tech Giants", location: "Bangalore", salary: "80,000/mo", type: "Full-time", category: "Private", minQualification: "UG", description: "React dev." },
            { title: "Bank PO", company: "SBI", location: "Anywhere", salary: "55,000/mo", type: "Full-time", category: "Government", minQualification: "UG", description: "Probationary Officer." },

            // PG Jobs
            { title: "Senior Consultant", company: "Big 4", location: "Gurgaon", salary: "1,20,000/mo", type: "Full-time", category: "Private", minQualification: "PG", description: "Consulting." },
            { title: "Research Fellow", company: "CSIR", location: "Chennai", salary: "45,000/mo", type: "Contract", category: "Government", minQualification: "PG", description: "Research." },
        ]
    });
    console.log("Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
