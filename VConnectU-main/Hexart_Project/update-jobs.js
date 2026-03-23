```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const UPDATED_JOBS_10TH = [
    // Government Jobs
    {
        title: "SSC GD Constable (General Duty)",
        company: "Staff Selection Commission (SSC)",
        description: "Join the paramilitary forces of India. Roles available in BSF, CISF, CRPF, SSB, ITBP, AR, and SSF. Responsibilities include border guarding, internal security, and maintaining law and order. Huge opportunity for 10th pass candidates with good physical fitness.",
        location: "Pan India",
        salary: "₹21,700 - ₹69,100 (Level-3)",
        type: "Full-time",
        category: "Government",
        minQualification: "TENTH",
        requiredSkills: "Physical Fitness, Discipline, Hindi/English Basic, General Awareness",
        deadline: new Date('2025-12-31'),
    },
    {
        title: "Track Maintainer Grade-IV (Group D)",
        company: "Indian Railways (RRB)",
        description: "Crucial role in maintaining railway tracks to ensure safe train operations. Work involves patrolling tracks, checking track readings, and general maintenance. Benefits include government quarters, medical facilities, and railway passes.",
        location: "Pan India (Various Zones)",
        salary: "₹18,000 - ₹56,900 + Allowances",
        type: "Full-time",
        category: "Government",
        minQualification: "TENTH",
        requiredSkills: "Physical Endurance, Basic Technical Knowledge, Safety Awareness, Teamwork",
        deadline: new Date('2026-01-15'),
    },
    {
        title: "Multi-Tasking Staff (MTS)",
        company: "DRDO & Central Govt Ministries",
        description: "Provide general assistance in government offices. Duties include physical maintenance of records, photocopying, sending faxes, opening & closing offices, and other non-technical work. Excellent work-life balance and central government benefits.",
        location: "New Delhi / Pan India",
        salary: "₹18,000 - ₹22,000 (Level-1)",
        type: "Full-time",
        category: "Government",
        minQualification: "TENTH",
        requiredSkills: "Office Assistance, Filing, Basic Computer Skills, Communication",
        deadline: new Date('2026-02-28'),
    },
    {
        title: "Gramin Dak Sevak (GDS)",
        company: "India Post",
        description: "Serve rural communities as Branch Postmaster (BPM) or Assistant Branch Postmaster (ABPM). Responsibilities include mail delivery, handling small savings schemes, and payments. Must know the local language.",
        location: "Rural India (Various Circles)",
        salary: "₹10,000 - ₹14,500 + Allowances",
        type: "Full-time",
        category: "Government",
        minQualification: "TENTH",
        requiredSkills: "Local Language, Cycling, Basic Computer Skills, Customer Service",
        deadline: new Date('2026-01-10'),
    },
    {
        title: "Anganwadi Worker / Helper",
        company: "Ministry of Women & Child Development",
        description: "Work at the grassroots level for child and mother care. diverse roles including health monitoring, supplementary nutrition distribution, and preschool education. Ideal for candidates looking to serve their local community.",
        location: "State Specific (e.g., UP, MP, Odisha)",
        salary: "₹5,000 - ₹10,000 (Honorarium)",
        type: "Full-time",
        category: "Government",
        minQualification: "TENTH",
        requiredSkills: "Child Care, Community Service, Local Language, Patience",
        deadline: new Date('2026-03-31'),
    },

    // Private Jobs
    {
        title: "Delivery Partner",
        company: "Blinkit / Zomato / Swiggy",
        description: "Earn by delivering food and groceries. Choose your own shifts and get weekly payouts. Incentives available for peak hours and good performance. Requires a 2-wheeler and a smartphone.",
        location: "Pan India (Metro Cities)",
        salary: "Up to ₹25,000/month",
        type: "Full-time / Part-time",
        category: "Private",
        minQualification: "TENTH",
        requiredSkills: "Driving (2-Wheeler), Navigation, Smartphone Usage, time Management",
        deadline: new Date('2025-12-30'),
    },
    {
        title: "Data Entry Operator",
        company: "Yannav Global Solutions",
        description: "Maintain database by entering new and updated customer and account information. Prepares source data for computer entry by compiling and sorting information. Good typing speed is essential.",
        location: "Noida / Remote Options",
        salary: "₹15,000 - ₹25,000/month",
        type: "Full-time",
        category: "Private",
        minQualification: "TENTH",
        requiredSkills: "Typing Speed >30 WPM, Basic Excel, Detail Oriented, Data Accuracy",
        deadline: new Date('2026-01-20'),
    },
    {
        title: "Warehouse Associate",
        company: "Delhivery / E-commerce Logistics",
        description: "Manage inventory in a fast-paced warehouse. Tasks include receiving shipments, scanning barcodes, sorting packages, and packing orders for dispatch. Safety shoes and training provided.",
        location: "Gurgaon / Bangalore / Bhiwandi",
        salary: "₹12,000 - ₹18,000/month",
        type: "Full-time",
        category: "Private",
        minQualification: "TENTH",
        requiredSkills: "Physical Stamina, Packaging, Inventory Basics, Scanning",
        deadline: new Date('2026-01-05'),
    },
    {
        title: "Security Guard",
        company: "SIS India Ltd.",
        description: "Secure premises and personnel by patrolling property, monitoring surveillance equipment, and inspecting buildings and access points. Prevent losses and damage by reporting irregularities.",
        location: "Mumbai / Pune / Hyderabad",
        salary: "₹15,000 - ₹20,000/month",
        type: "Full-time",
        category: "Private",
        minQualification: "TENTH",
        requiredSkills: "Vigilance, Physical Fitness, Basic Reporting, Integrity",
        deadline: new Date('2026-02-15'),
    },
    {
        title: "Office Peon / Office Assistant",
        company: "Corporate Services",
        description: "Ensure the office runs smoothly by maintaining cleanliness, serving beverages, handling mail, and running outside errands (bank/post office). Punctuality and hygiene are key.",
        location: "Delhi NCR / Mumbai",
        salary: "₹10,000 - ₹15,000/month",
        type: "Full-time",
        category: "Private",
        minQualification: "TENTH",
        requiredSkills: "Time Management, Hygiene, Basic Hindi/English, Reliability",
        deadline: new Date('2026-01-25'),
    },
];

async function main() {
    try {
        console.log("Updating jobs...");
        for (const job of UPDATED_JOBS_10TH) {
            // Find and update, or create if missing
            const existing = await prisma.job.findFirst({
                where: {
                    title: job.title,
                    company: job.company
                }
            });

            if (existing) {
                await prisma.job.update({
                    where: { id: existing.id },
                    data: job
                });
                console.log(`Updated: ${ job.title } `);
            } else {
                await prisma.job.create({ data: job });
                console.log(`Created: ${ job.title } `);
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
