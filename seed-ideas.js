const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SAMPLE_IDEAS = [
    {
        title: "AI-Powered Career Counselor",
        problem: "Students struggle to find career paths that match their skills and interests.",
        solution: "An AI agent that analyzes student projects, skills, and market trends to provide personalized career roadmaps.",
        technologies: "Next.js, OpenAI, Prisma, MongoDB",
        impact: "Helping millions of students navigate their professional journey effectively.",
        contactEmail: "alice@example.com",
        contactPhone: "9876543210"
    },
    {
        title: "Smart Waste Management System",
        problem: "Inefficient waste collection leads to overflowing bins and environmental pollution.",
        solution: "IoT sensors on bins that notify collection services when they are 80% full, optimized by route planning algorithms.",
        technologies: "IoT, Node.js, Python, MongoDB",
        impact: "Reducing collection costs by 30% and improving city cleanliness.",
        contactEmail: "alice@example.com",
        contactPhone: "9876543210"
    },
    {
        title: "Decentralized Skill Verification",
        problem: "Fake certifications are widespread, making it hard for employers to verify talent.",
        solution: "A blockchain-based platform where skills are verified by peers or institutions and recorded as immutable NFTs.",
        technologies: "Ethereum, Solidity, Web3.js, MongoDB",
        impact: "Eliminating resume fraud and building a high-trust talent marketplace.",
        contactEmail: "bob@example.com",
        contactPhone: "9123456789"
    },
    {
        title: "Personalized Health Companion",
        problem: "Generic health advice doesn't account for individual genetic and lifestyle differences.",
        solution: "A wearable-integrated app that uses ML to provide real-time dietary and exercise suggestions based on biometrics.",
        technologies: "React Native, TensorFlow Lite, MongoDB",
        impact: "Improving long-term health outcomes through proactive, personalized care.",
        contactEmail: "charlie@example.com",
        contactPhone: "9988776655"
    }
];

async function main() {
    console.log("Seeding sample innovation ideas...");
    
    // First, ensure the mock users exist
    const users = await prisma.user.findMany();
    if (users.length === 0) {
        console.log("⚠️ No users found. Please run seed-mock-users.js first.");
        return;
    }

    const alice = await prisma.user.findFirst({ where: { email: "alice@example.com" } });
    const bob = await prisma.user.findFirst({ where: { email: "bob@example.com" } });
    const charlie = await prisma.user.findFirst({ where: { email: "charlie@example.com" } });

    for (const idea of SAMPLE_IDEAS) {
        // Assign to a user based on contact email, or default to Alice
        let targetUserId = alice.id;
        if (idea.contactEmail === "bob@example.com" && bob) targetUserId = bob.id;
        if (idea.contactEmail === "charlie@example.com" && charlie) targetUserId = charlie.id;

        const { contactEmail, contactPhone, ...ideaData } = idea;
        
        await prisma.idea.create({
            data: {
                ...ideaData,
                contactEmail,
                contactPhone,
                userId: targetUserId
            }
        });
        console.log(`✅ Created Idea: ${idea.title}`);
    }
    
    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
