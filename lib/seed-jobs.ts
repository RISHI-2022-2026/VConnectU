import { prisma } from "@/lib/db";
import { QualificationLevel } from "@prisma/client";

const JOBS_10TH = [
    // Government Jobs
    {
        title: "SSC GD Constable (General Duty)",
        company: "Staff Selection Commission (SSC)",
        description: "General duty roles in BSF, CISF, CRPF, SSB, ITBP, AR, SSF. Requires physical fitness and 10th pass.",
        location: "Pan India",
        salary: "₹21,700 - ₹69,100",
        type: "Full-time",
        category: "Government",
        minQualification: QualificationLevel.TENTH,
        requiredSkills: "Physical Fitness, Discipline, Hindi/English Basic",
        deadline: new Date("2026-01-31T23:59:59Z"),
        selectionProcessString: "Computer Based Examination (CBE), Physical Efficiency Test (PET), Physical Standard Test (PST), Medical Examination",
        examDate: new Date("2026-03-01T10:00:00Z"), // Hypothetical date
        examMode: "Online (CBE)",
        link: "https://ssc.gov.in",
    },
    {
        title: "Track Maintainer Grade-IV (Group D)",
        company: "Indian Railways (RRB)",
        description: "Maintenance of railway tracks, signalling, and other departments. Huge vacancy drives.",
        location: "Pan India",
        salary: "₹18,000 - ₹56,900",
        type: "Full-time",
        category: "Government",
        minQualification: QualificationLevel.TENTH,
        requiredSkills: "Physical Endurance, Basic Technical Knowledge",
        deadline: new Date("2026-02-28T23:59:59Z"), // Tentative
        selectionProcessString: "Computer Based Test (CBT), Physical Efficiency Test (PET), Document Verification, Medical Examination",
        examDate: new Date("2026-05-15T10:00:00Z"), // Tentative
        examMode: "Online (CBT)",
        link: "https://www.rrbapply.gov.in",
    },
    {
        title: "Multi-Tasking Staff (MTS)",
        company: "DRDO & Central Govt Ministries",
        description: "Non-technical roles including general assistance, file maintenance, and office support.",
        location: "New Delhi / Pan India",
        salary: "₹18,000 - ₹22,000",
        type: "Full-time",
        category: "Government",
        minQualification: QualificationLevel.TENTH,
        requiredSkills: "Office Assistance, Filing, Basic Communication",
        link: "https://drdo.gov.in/careers",
    },
    {
        title: "Gramin Dak Sevak (GDS)",
        company: "India Post",
        description: "Branch Postmaster (BPM) and Assistant Branch Postmaster (ABPM) roles in rural post offices.",
        location: "Rural India (Various Circles)",
        salary: "₹10,000 - ₹14,500 + Allowances",
        type: "Full-time",
        category: "Government",
        minQualification: QualificationLevel.TENTH,
        requiredSkills: "Local Language, Cycling, Basic Computer Skills",
        link: "https://indiapostgdsonline.gov.in",
    },
    {
        title: "Anganwadi Worker / Helper",
        company: "Ministry of Women & Child Development",
        description: "Community support, child care, and health monitoring in local anganwadi centers.",
        location: "State Specific (e.g., UP, MP, Odisha)",
        salary: "₹5,000 - ₹10,000 (Honorarium)",
        type: "Full-time",
        category: "Government",
        minQualification: QualificationLevel.TENTH,
        requiredSkills: "Child Care, Community Service, Local Language",
        link: "https://wcd.nic.in",
    },

    // Private Jobs
    {
        title: "Delivery Partner",
        company: "Blinkit / Zomato / Swiggy",
        description: "Deliver food and grocery orders to customers. Flexible shifts and weekly payouts.",
        location: "Pan India (Metro Cities)",
        salary: "Up to ₹25,000/month",
        type: "Full-time / Part-time",
        category: "Private",
        minQualification: QualificationLevel.TENTH,
        requiredSkills: "Driving (2-Wheeler), Navigation, Smartphone Usage",
        link: "https://blinkit.com/careers",
    },
    {
        title: "Data Entry Operator",
        company: "Yannav Global Solutions",
        description: "Back-office data entry work. Typing speed and accuracy required. Training provided.",
        location: "Noida / Remote Options",
        salary: "₹15,000 - ₹25,000/month",
        type: "Full-time",
        category: "Private",
        minQualification: QualificationLevel.TENTH,
        requiredSkills: "Typing Speed >30 WPM, Basic Excel, Detail Oriented",
        link: "https://www.naukri.com/data-entry-operator-jobs",
    },
    {
        title: "Warehouse Associate",
        company: "Delhivery / E-commerce Logistics",
        description: "Scanning, sorting, packing, and loading packages in the warehouse fulfillment center.",
        location: "Gurgaon / Bangalore / Bhiwandi",
        salary: "₹12,000 - ₹18,000/month",
        type: "Full-time",
        category: "Private",
        minQualification: QualificationLevel.TENTH,
        requiredSkills: "Physical Stamina, Packaging, Inventory Basics",
        link: "https://www.delhivery.com/careers",
    },
    {
        title: "Security Guard",
        company: "SIS India Ltd.",
        description: "Guarding commercial and residential premises. Ensuring safety and visitor management.",
        location: "Mumbai / Pune / Hyderabad",
        salary: "₹15,000 - ₹20,000/month",
        type: "Full-time",
        category: "Private",
        minQualification: QualificationLevel.TENTH,
        requiredSkills: "Vigilance, Physical Fitness, Basic Reporting",
        link: "https://sisindia.com/careers",
    },
    {
        title: "Office Peon / Office Assistant",
        company: "Corporate Services",
        description: "Handling pantry, serving tea/coffee, filing documents, and running office errands.",
        location: "Delhi NCR / Mumbai",
        salary: "₹10,000 - ₹15,000/month",
        type: "Full-time",
        category: "Private",
        minQualification: QualificationLevel.TENTH,
        requiredSkills: "Time Management, Hygiene, Basic Hindi/English",
        link: "https://www.indeed.com/q-Office-Peon-jobs.html",
    },
    // End of JOBS_10TH
];

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
        minQualification: QualificationLevel.TWELFTH,
        requiredSkills: "Typing Speed, English/Hindi, Basic Computer Knowledge",
        link: "https://ssc.gov.in",
        deadline: new Date("2026-04-30T23:59:59Z"),
        selectionProcessString: "Tier-I (CBT), Tier-II (CBT + Typing Test)",
        examDate: new Date("2026-06-15T10:00:00Z"),
        examMode: "Online (CBT)",
    },
    {
        title: "NDA & NA Examination",
        company: "UPSC",
        description: "Admission to Army, Navy and Air Force wings of the NDA. Prestigious entry for 12th pass unmarried candidates.",
        location: "Pan India",
        salary: "Stipend ₹56,100 during training",
        type: "Full-time",
        category: "Government",
        minQualification: QualificationLevel.TWELFTH,
        requiredSkills: "Physical Fitness, Leadership, Mathematics, Physics",
        link: "https://upsconline.nic.in",
        deadline: new Date("2026-01-10T23:59:59Z"),
        selectionProcessString: "Written Exam, SSB Interview, Medical Exam",
        examDate: new Date("2026-04-21T10:00:00Z"),
        examMode: "Offline",
    },
    {
        title: "Assistant Loco Pilot (ALP)",
        company: "Indian Railways (RRB)",
        description: "Assist in driving trains. Requires 12th (PCM) or ITI/Diploma. Technically rich role.",
        location: "Various Railway Zones",
        salary: "₹19,900 - ₹63,200 + Allowances",
        type: "Full-time",
        category: "Government",
        minQualification: QualificationLevel.TWELFTH,
        requiredSkills: "Technical Aptitude, Vision (A1 Standard), Discipline",
        link: "https://www.rrbapply.gov.in",
        deadline: new Date("2026-03-31T23:59:59Z"),
        selectionProcessString: "CBT-1, CBT-2, CBAT (Psycho Test), Document Verification",
        examDate: new Date("2026-08-01T10:00:00Z"),
        examMode: "Online (CBT)",
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
        minQualification: QualificationLevel.TWELFTH,
        requiredSkills: "English Fluency, Communication, Empathy",
        link: "https://www.naukri.com/customer-support-executive-jobs",
    },
    {
        title: "Retail Sales Associate",
        company: "Reliance Retail / Titan",
        description: "Showroom sales, inventory management, and customer assistance. Good personality required.",
        location: "Mumbai / Delhi / Metros",
        salary: "₹18,000 - ₹25,000 + Incentives",
        type: "Full-time",
        category: "Private",
        minQualification: QualificationLevel.TWELFTH,
        requiredSkills: "Sales, Communication, Grooming",
        link: "https://www.indeed.com/q-Retail-Sales-Associate-jobs.html",
    },
    {
        title: "Front Desk Receptionist",
        company: "Corporate & Hospitality",
        description: "Manage front desk, attend calls, and welcome guests.",
        location: "Major Cities",
        salary: "₹15,000 - ₹20,000/month",
        type: "Full-time",
        category: "Private",
        minQualification: QualificationLevel.TWELFTH,
        requiredSkills: "Politeness, Telephone Etiquette, Basic Computer",
        link: "https://www.linkedin.com/jobs/search/?keywords=Front%20Desk%20Receptionist",
    }
];

const JOBS_UG = [
    // Example UG IT job
    {
        title: "Software Engineer Trainee",
        company: "Tech Solutions Ltd",
        description: "Entry level software development role focusing on web technologies. Works with a mentor on real projects.",
        location: "Bangalore",
        salary: "₹3,00,000 - ₹5,00,000 per annum",
        type: "Full-time",
        category: "Private",
        minQualification: QualificationLevel.UG,
        requiredSkills: "JavaScript, React, Node.js",
        link: "https://www.naukri.com/software-engineer-trainee-jobs",
        deadline: new Date("2026-05-31T23:59:59Z"),
        selectionProcessString: "Online Application, Technical Test, HR Interview",
        examDate: new Date("2026-06-15T10:00:00Z"),
        examMode: "Online"
    },
    // Example UG Non‑IT government job
    {
        title: "Junior Engineer (Civil)",
        company: "Public Works Department",
        description: "Assist senior engineers in planning and executing civil projects. Requires basic engineering knowledge.",
        location: "Statewide",
        salary: "₹2,20,000 - ₹3,00,000 per annum",
        type: "Full-time",
        category: "Government",
        minQualification: QualificationLevel.UG,
        requiredSkills: "Civil Engineering fundamentals, AutoCAD",
        link: "https://www.upsc.gov.in/je-civil",
        deadline: new Date("2026-04-20T23:59:59Z"),
        selectionProcessString: "Written Exam, Interview",
        examDate: new Date("2026-05-10T10:00:00Z"),
        examMode: "Offline"
    }
];

export async function seedJobsForQualification(level: QualificationLevel) {
    let jobsToSeed = [];

    if (level === QualificationLevel.TENTH) {
        jobsToSeed = JOBS_10TH;
    } else if (level === QualificationLevel.TWELFTH) {
        jobsToSeed = JOBS_12TH;
    } else if (level === QualificationLevel.UG) {
        jobsToSeed = JOBS_UG;
    } else {
        return;
    }

    console.log(`Checking for existing ${level} level jobs...`);

    for (const job of jobsToSeed) {
        const existing = await prisma.job.findFirst({
            where: {
                title: job.title,
                company: job.company,
                minQualification: level
            }
        });

        if (!existing) {
            await prisma.job.create({
                data: job
            });
            console.log(`Seeded job: ${job.title} at ${job.company}`);
        }
    }
}
