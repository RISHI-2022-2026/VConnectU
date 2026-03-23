const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const COMPETITIONS = [
    {
        title: "Weekly Contest 482",
        platform: "LeetCode",
        description: "Solve 4 algorithmic problems in 90 minutes. Global ranking and rating update.",
        link: "https://leetcode.com/contest/",
        prize: "LeetCoins, Badges",
        deadline: new Date("2025-12-27T18:30:00Z"), // 27 Dec 6:30 PM PST ~ 28 Dec morning IST
        startDate: new Date("2025-12-27T18:30:00Z"),
        type: "Coding Contest"
    },
    {
        title: "Starters 219",
        platform: "CodeChef",
        description: "Rated contest for Division 1, 2, 3 & 4. Perfect for beginners to experts.",
        link: "https://www.codechef.com/contests",
        prize: "Global Rank, Rating",
        deadline: new Date("2025-12-31T06:30:00Z"),
        startDate: new Date("2025-12-31T06:30:00Z"),
        type: "Coding Contest"
    },
    {
        title: "Internship Fair: Taylor & Francis",
        platform: "HackerRank",
        description: "Hiring challenge for internship roles. First round is a coding assessment.",
        link: "https://www.hackerrank.com/contests",
        prize: "Internship Opportunity",
        deadline: new Date("2026-01-16T23:59:59Z"),
        startDate: new Date("2025-12-26T00:00:00Z"),
        type: "Hiring Challenge"
    },
    {
        title: "CodeTantra 2K25",
        platform: "Unstop",
        description: "National level coding contest featuring 'Bug Busters' prelims and 'Code Forge' main round.",
        link: "https://unstop.com/hackathons/codetantra2k25",
        prize: "Certificates, Cash Rewards",
        deadline: new Date("2025-12-27T11:30:00Z"),
        startDate: new Date("2025-12-26T06:30:00Z"),
        type: "Hackathon"
    },
    {
        title: "GDG On Campus Praxis 2.0",
        platform: "Google Developer Groups",
        description: "Solve real-world problems using Google technologies. Open to all students.",
        link: "https://unstop.com/",
        prize: "Swags, Mentorship",
        deadline: new Date("2026-01-15T23:59:59Z"),
        startDate: new Date("2025-12-24T00:00:00Z"),
        type: "Hackathon"
    }
];

async function main() {
    console.log("Seeding competitions...");
    for (const comp of COMPETITIONS) {
        const existing = await prisma.competition.findFirst({
            where: {
                title: comp.title,
                platform: comp.platform
            }
        });

        if (!existing) {
            await prisma.competition.create({
                data: comp
            });
            console.log(`Created competition: ${comp.title}`);
        } else {
            console.log(`Competition already exists: ${comp.title}`);
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
