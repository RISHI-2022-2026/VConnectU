const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const REALISTIC_COMPETITIONS = [
    {
        title: "eRaksha Hackathon 2026",
        platform: "IIT Delhi / CyberPeace",
        description: "National level hackathon focusing on defense-AI, digital safety, and cybersecurity challenges.",
        link: "https://cyberchallenge.in/",
        prize: "Cash Prizes, Recognition, Networking",
        deadline: new Date("2026-01-16T23:59:59Z"),
        startDate: new Date("2026-01-16T10:00:00Z"),
        type: "Hackathon"
    },
    {
        title: "Google Lakecity Hackathon 2026",
        platform: "GDG Udaipur",
        description: "Build innovative solutions using Google AI & Cloud. Regional hackathon with high impact.",
        link: "https://community.dev/gdg-cloud-udaipur/",
        prize: "Prizes worth ₹100,000, Swags",
        deadline: new Date("2026-01-28T23:59:59Z"),
        startDate: new Date("2026-01-29T10:00:00Z"),
        type: "Hackathon"
    },
    {
        title: "Byte Quest - AI Vibe 2026",
        platform: "Unstop",
        description: "24-hour online hackathon for university students to solve real-world problems using AI tools.",
        link: "https://unstop.com/",
        prize: "Internship Interviews, Cash Rewards",
        deadline: new Date("2026-01-02T23:59:59Z"),
        startDate: new Date("2026-01-03T09:00:00Z"),
        type: "Hackathon"
    },
    {
        title: "CodeWars 2026",
        platform: "Newton School",
        description: "ICPC-style individual competitive programming contest. High stakes and global participants.",
        link: "https://unstop.com/o/CodeWars2026",
        prize: "MacBook, iPad, Cash Prizes",
        deadline: new Date("2026-01-22T23:59:59Z"),
        startDate: new Date("2026-01-23T18:00:00Z"),
        type: "Coding Contest"
    },
    {
        title: "AI for All Challenge",
        platform: "Meta / Factly",
        description: "Build open-source AI solutions for India's data readiness. Social impact focused.",
        link: "https://reskilll.com/meta",
        prize: "Equity-free grants, Mentorship",
        deadline: new Date("2026-01-23T23:59:59Z"),
        startDate: new Date("2026-01-05T00:00:00Z"),
        type: "Hackathon"
    },
    {
        title: "EnCode 2026: AI Hack",
        platform: "IIT Guwahati",
        description: "Flagship AI Hackathon of IIT Guwahati. Solve complex business problems using LLMs.",
        link: "https://unstop.com/",
        prize: "Total Prize Pool ₹200,000",
        deadline: new Date("2026-01-15T23:59:59Z"),
        startDate: new Date("2026-01-23T10:00:00Z"),
        type: "Hackathon"
    },
    {
        title: "DeveloperWeek 2026 Hackathon",
        platform: "DeveloperWeek",
        description: "One of the world's largest virtual hackathons. Build apps on sponsor technologies.",
        link: "https://www.developerweek.com/hackathon/",
        prize: "$25,000+ in Sponsor Prizes",
        deadline: new Date("2026-02-20T23:59:59Z"),
        startDate: new Date("2026-02-02T00:00:00Z"),
        type: "Hackathon"
    },
    {
        title: "Swift Student Challenge 2026",
        platform: "Apple",
        description: "Showcase your coding skills by creating an incredible app playground using Swift.",
        link: "https://developer.apple.com/swift-student-challenge/",
        prize: "AirPods Max, Swift Student Challenge pin set",
        deadline: new Date("2026-02-28T23:59:59Z"),
        startDate: new Date("2026-02-06T00:00:00Z"),
        type: "App Challenge"
    },
    {
        title: "LeetCode Weekly Contest 485",
        platform: "LeetCode",
        description: "Weekly algorithmic challenge. 4 problems, 90 minutes. Rated for all users.",
        link: "https://leetcode.com/contest/",
        prize: "LeetCoins, Rating Update",
        deadline: new Date("2026-01-18T08:00:00Z"),
        startDate: new Date("2026-01-18T08:00:00Z"),
        type: "Coding Contest"
    },
    {
        title: "CodeChef Starters 225",
        platform: "CodeChef",
        description: "Short coding contest for all divisions. Improve your competitive programming rating.",
        link: "https://www.codechef.com/contests",
        prize: "Global Rank, CodeChef Laddus",
        deadline: new Date("2026-01-21T20:00:00Z"),
        startDate: new Date("2026-01-21T20:00:00Z"),
        type: "Coding Contest"
    },
    {
        title: "Commit To Change: AI Agents",
        platform: "Encode Club",
        description: "4-week online hackathon to build autonomous AI agents for productivity.",
        link: "https://www.encode.club/ai-hackathons",
        prize: "$10,000 Prize Pool",
        deadline: new Date("2026-02-10T23:59:59Z"),
        startDate: new Date("2026-01-13T00:00:00Z"),
        type: "Hackathon"
    },
    {
        title: "Canadian Computing Competition 2026",
        platform: "University of Waterloo",
        description: "Global programming contest for students to test their design and algorithm skills.",
        link: "https://cemc.uwaterloo.ca/contests/ccc.html",
        prize: "Certificates, Honors",
        deadline: new Date("2026-02-10T23:59:59Z"),
        startDate: new Date("2026-02-18T00:00:00Z"),
        type: "Coding Contest"
    },
    {
        title: "Anantya Codigo 2026",
        platform: "PCCOE Pune",
        description: "Multi-round competitive programming contest featuring algorithmic and speed rounds.",
        link: "https://unstop.com/",
        prize: "Cash Prizes worth ₹50,000",
        deadline: new Date("2026-01-24T23:59:59Z"),
        startDate: new Date("2026-01-25T10:00:00Z"),
        type: "Coding Contest"
    },
    {
        title: "Sprint4Good AI Hack",
        platform: "Reskilll",
        description: "12-hour sprint to build AI-powered solutions for accessibility and inclusivity.",
        link: "https://reskilll.com/",
        prize: "Goodies, Certification",
        deadline: new Date("2026-01-11T23:59:59Z"),
        startDate: new Date("2026-01-12T09:00:00Z"),
        type: "Hackathon"
    },
    {
        title: "Winter Contest 2026",
        platform: "CPUlm",
        description: "Themed coding contest for students and professionals. Challenges on algorithms and data.",
        link: "https://wintercontest.io/",
        prize: "Swags and Vouchers",
        deadline: new Date("2026-01-29T23:59:59Z"),
        startDate: new Date("2026-01-31T00:00:00Z"),
        type: "Coding Contest"
    },
    {
        title: "MLH Global Hack Week: Data",
        platform: "Major League Hacking",
        description: "A week-long celebration of data science, analytics, and machine learning.",
        link: "https://globalhackweek.mlh.io/",
        prize: "Stickers, T-shirts, Digital Badges",
        deadline: new Date("2026-02-13T23:59:59Z"),
        startDate: new Date("2026-02-13T00:00:00Z"),
        type: "Hackweek"
    },
    {
        title: "Snow Fest 2026",
        platform: "Dev.events",
        description: "Online coding challenge to build winter-themed apps and games.",
        link: "https://dev.events/",
        prize: "Amazon Gift Cards",
        deadline: new Date("2026-02-01T23:59:59Z"),
        startDate: new Date("2026-01-01T00:00:00Z"),
        type: "App Challenge"
    },
    {
        title: "EduInnovate Hackathon 2026",
        platform: "Dev.events",
        description: "Hackathon focused on educational technology and digital learning tools.",
        link: "https://dev.events/",
        prize: "Pro Subscriptions, Certificates",
        deadline: new Date("2026-01-31T23:59:59Z"),
        startDate: new Date("2026-01-01T00:00:00Z"),
        type: "Hackathon"
    },
    {
        title: "AutoHacks 2026",
        platform: "GDG Gandhinagar",
        description: "36-hour hackathon focused on autonomous systems and robotics innovation.",
        link: "https://autonomoushacks.co.in/",
        prize: "Cash Prizes worth ₹1.5 Lakhs",
        deadline: new Date("2026-01-09T23:59:59Z"),
        startDate: new Date("2026-01-10T09:00:00Z"),
        type: "Hackathon"
    },
    {
        title: "Imagine Cup 2026",
        platform: "Microsoft",
        description: "Global student technology competition. Build a startup using Azure AI.",
        link: "https://imaginecup.microsoft.com/",
        prize: "$100,000 and Mentorship from Satya Nadella",
        deadline: new Date("2026-01-31T23:59:59Z"),
        startDate: new Date("2025-10-01T00:00:00Z"),
        type: "Startup Challenge"
    },
    {
        title: "Google Summer of Code 2026",
        platform: "Google",
        description: "Global program for students and open-source beginners to contribute to open-source projects.",
        link: "https://summerofcode.withgoogle.com/",
        prize: "Stipend, Mentorship, Global Recognition",
        deadline: new Date("2026-04-05T23:59:59Z"),
        startDate: new Date("2026-05-01T00:00:00Z"),
        type: "Open Source"
    },
    {
        title: "HackerCup 2026: Qualification",
        platform: "Meta",
        description: "Meta's annual global programming competition. Solve algorithmic puzzles.",
        link: "https://www.facebook.com/codingcompetitions/hacker-cup/",
        prize: "Top Rank T-shirts, Global Ranking",
        deadline: new Date("2026-08-20T23:59:59Z"),
        startDate: new Date("2026-08-25T00:00:00Z"),
        type: "Coding Contest"
    }
];

async function main() {
    try {
        console.log("Seeding 20+ realistic competitions...");
        let count = 0;
        for (const comp of REALISTIC_COMPETITIONS) {
            const existing = await prisma.competition.findFirst({
                where: {
                    title: comp.title,
                    platform: comp.platform
                }
            });

            if (!existing) {
                await prisma.competition.create({ data: comp });
                console.log(`✅ Created competition: ${comp.title} on ${comp.platform}`);
                count++;
            } else {
                await prisma.competition.update({
                    where: { id: existing.id },
                    data: comp
                });
                console.log(`🔄 Updated competition: ${comp.title}`);
                count++;
            }
        }
        console.log(`Successfully processed ${count} competitions.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
