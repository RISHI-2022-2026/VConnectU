const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JOBS_12TH = [
    // Government
    {
        title: "SSC CHSL (LDC / DEO)",
        company: "Staff Selection Commission",
        description: "Lower Division Clerk, Junior Secretariat Assistant, and Data Entry Operator posts in various central govt ministries.",
        location: "Pan India",
        salary: "₹19,900 - ₹63,200",
        type: "Full-time",
        category: "Government",
        minQualification: "TWELFTH",
        requiredSkills: "Typing Speed, English/Hindi, Basic Computer Knowledge",
        deadline: new Date("2026-04-30T23:59:59Z"),
        selectionProcessString: "Tier-I (CBT), Tier-II (CBT + Typing Test)",
        examDate: new Date("2026-06-15T10:00:00Z"),
        examMode: "Online (CBT)",
        link: "https://ssc.nic.in/",
    },
    {
        title: "NDA & NA Examination",
        company: "UPSC",
        description: "Admission to Army, Navy and Air Force wings of the NDA. Prestigious entry for 12th pass unmarried candidates.",
        location: "Pan India",
        salary: "Stipend ₹56,100 during training",
        type: "Full-time",
        category: "Government",
        minQualification: "TWELFTH",
        requiredSkills: "Physical Fitness, Leadership, Mathematics, Physics",
        deadline: new Date("2026-01-10T23:59:59Z"),
        selectionProcessString: "Written Exam, SSB Interview, Medical Exam",
        examDate: new Date("2026-04-21T10:00:00Z"),
        examMode: "Offline",
        link: "https://www.upsc.gov.in/examinations",
    },
    {
        title: "Assistant Loco Pilot (ALP)",
        company: "Indian Railways (RRB)",
        description: "Assist in driving trains. Requires 12th (PCM) or ITI/Diploma. Technically rich role.",
        location: "Various Railway Zones",
        salary: "₹19,900 - ₹63,200 + Allowances",
        type: "Full-time",
        category: "Government",
        minQualification: "TWELFTH",
        requiredSkills: "Technical Aptitude, Vision (A1 Standard), Discipline",
        deadline: new Date("2026-03-31T23:59:59Z"),
        selectionProcessString: "CBT-1, CBT-2, CBAT (Psycho Test), Document Verification",
        examDate: new Date("2026-08-01T10:00:00Z"),
        examMode: "Online (CBT)",
        link: "https://www.rrb.gov.in/",
    },

    // Private
    {
        title: "Customer Support Executive",
        company: "Tech Mahindra / Wipro",
        description: "Handle customer queries via voice/chat. Good communication skills required. Rotational shifts.",
        location: "Noida / Pune / Bangalore",
        salary: "₹15,000 - ₹22,000/month",
        type: "Full-time",
        category: "Private",
        minQualification: "TWELFTH",
        requiredSkills: "English Fluency, Communication, Empathy",
        link: "https://careers.techmahindra.com/",
    },
    {
        title: "Retail Sales Associate",
        company: "Reliance Retail / Titan",
        description: "Showroom sales, inventory management, and customer assistance. Good personality required.",
        location: "Mumbai / Delhi / Metros",
        salary: "₹18,000 - ₹25,000 + Incentives",
        type: "Full-time",
        category: "Private",
        minQualification: "TWELFTH",
        requiredSkills: "Sales, Communication, Grooming",
        link: "https://www.relianceretail.com/careers",
    },
    {
        title: "Front Desk Receptionist",
        company: "Corporate & Hospitality",
        description: "Manage front desk, attend calls, and welcome guests.",
        location: "Major Cities",
        salary: "₹15,000 - ₹20,000/month",
        type: "Full-time",
        category: "Private",
        minQualification: "TWELFTH",
        requiredSkills: "Politeness, Telephone Etiquette, Basic Computer",
        link: "https://jobs.marriott.com/",
    }
];

async function main() {
    console.log("Seeding 12th grade jobs...");
    for (const job of JOBS_12TH) {
        const existing = await prisma.job.findFirst({
            where: {
                title: job.title,
                company: job.company,
                minQualification: "TWELFTH"
            }
        });

        if (!existing) {
            await prisma.job.create({ data: job });
            console.log(`Seeded: ${job.title}`);
        } else {
            console.log(`Skipped (Exists): ${job.title}`);
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
