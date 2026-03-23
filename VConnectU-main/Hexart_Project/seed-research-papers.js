const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RESEARCH_PAPERS = [
    {
        title: "Advances in Large Language Models for Medical Diagnosis",
        publisher: "IEEE",
        conference: "EMBC 2026",
        description: "Seeking original research on LLM applications in healthcare, specifically focused on diagnostic accuracy and ethical considerations.",
        link: "https://embc.ieee.org/2026/call-for-papers/",
        deadline: new Date("2026-03-15T23:59:59Z"),
        topic: "Healthcare AI"
    },
    {
        title: "Sustainability in Cloud Computing Infrastructure",
        publisher: "ACM",
        conference: "SIGMETRICS 2026",
        description: "Call for papers on green computing, energy-efficient data centers, and sustainable software engineering practices.",
        link: "https://www.sigmetrics.org/sigmetrics2026/",
        deadline: new Date("2026-02-10T23:59:59Z"),
        topic: "Green IT"
    },
    {
        title: "Decentralized Finance: Security and Scalability",
        publisher: "Nature",
        conference: "Nature Communications",
        description: "A special issue focusing on the cryptographic underpinnings and economic models of DeFi platforms.",
        link: "https://www.nature.com/ncomms/",
        deadline: new Date("2026-04-01T23:59:59Z"),
        topic: "Blockchain"
    },
    {
        title: "Human-Robot Interaction in Home Environments",
        publisher: "Frontiers",
        conference: "HRI 2026",
        description: "Full paper submissions invited for research on social robotics and assistance technologies for elderly care.",
        link: "https://humanrobotinteraction.org/2026/",
        deadline: new Date("2026-01-30T23:59:59Z"),
        topic: "Robotics"
    }
];

async function main() {
    console.log("Seeding research papers...");
    for (const paper of RESEARCH_PAPERS) {
        const existing = await prisma.researchPaper.findFirst({
            where: {
                title: paper.title,
                publisher: paper.publisher
            }
        });

        if (!existing) {
            await prisma.researchPaper.create({
                data: paper
            });
            console.log(`Created research paper call: ${paper.title}`);
        } else {
            console.log(`Research paper call already exists: ${paper.title}`);
        }
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
