const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const REALISTIC_JOBS = [
    // --- 10TH PASS ---
    {
        title: "Railway Group D (Trackman/helper)",
        company: "Indian Railways (RRB)",
        description: "Maintain railway tracks and assist in various technical departments. Includes pension and medical benefits.",
        location: "Pan India (Various Zones)",
        salary: "₹18,000 - ₹23,000 + Allowances",
        type: "Full-time",
        category: "Government",
        minQualification: "TENTH",
        requiredSkills: "Physical Strength, Safety Awareness",
        link: "https://www.rrbapply.gov.in",
        deadline: new Date('2026-03-15')
    },
    {
        title: "SSC GD Constable",
        company: "Staff Selection Commission (SSC)",
        description: "Join BSF, CRPF, or CISF as a General Duty Constable. Protect borders and maintain internal peace.",
        location: "Pan India",
        salary: "₹21,700 - ₹69,100",
        type: "Full-time",
        category: "Government",
        minQualification: "TENTH",
        requiredSkills: "Physical Fitness, Discipline",
        link: "https://ssc.gov.in",
        deadline: new Date('2026-04-30')
    },
    {
        title: "Multi Tasking Staff (MTS)",
        company: "DRDO / Govt Ministries",
        description: "Provide general assistance and office support in various central government departments.",
        location: "Delhi / Pan India",
        salary: "₹18,000 - ₹22,000",
        type: "Full-time",
        category: "Government",
        minQualification: "TENTH",
        requiredSkills: "Basic Literacy, Office Support",
        link: "https://drdo.gov.in",
        deadline: new Date('2026-05-20')
    },
    {
        title: "Gramin Dak Sevak (GDS)",
        company: "India Post",
        description: "Deliver mail and handle branch office tasks in rural areas. Merit-based selection.",
        location: "Rural India",
        salary: "₹12,000 - ₹15,000",
        type: "Full-time",
        category: "Government",
        minQualification: "TENTH",
        requiredSkills: "Local Language, Cycling",
        link: "https://indiapostgdsonline.gov.in",
        deadline: new Date('2026-06-10')
    },
    {
        title: "Delivery Executive",
        company: "Zomato / Swiggy",
        description: "Deliver food orders to customers. Flexible hours and weekly payouts with incentives.",
        location: "Pan India (Metro Cities)",
        salary: "₹15,000 - ₹25,000",
        type: "Flexible",
        category: "Private",
        minQualification: "TENTH",
        requiredSkills: "Driving, Smartphone Navigation",
        link: "https://www.zomato.com/deliver",
        deadline: new Date('2026-12-31')
    },
    {
        title: "Warehouse Helper",
        company: "Amazon / Flipkart Logistics",
        description: "Scanning, sorting, and packing packages in large fulfillment centers. Training provided.",
        location: "Gurgaon / Bangalore",
        salary: "₹14,000 - ₹19,000",
        type: "Full-time",
        category: "Private",
        minQualification: "TENTH",
        requiredSkills: "Stamina, Punctuality",
        link: "https://amazon.jobs",
        deadline: new Date('2026-08-15')
    },
    {
        title: "Security Guard",
        company: "G4S Secure Solutions",
        description: "Ensure safety of corporate offices and residential complexes. Shifts available worldwide.",
        location: "Major Cities",
        salary: "₹16,000 - ₹22,000",
        type: "Full-time",
        category: "Private",
        minQualification: "TENTH",
        requiredSkills: "Vigilance, Integrity",
        link: "https://www.g4s.com/en-in",
        deadline: new Date('2026-09-30')
    },
    {
        title: "Store Assistant",
        company: "Reliance Retail / BigBazaar",
        description: "Assist in inventory management, shelf stocking, and helping customers find products.",
        location: "Metro Cities",
        salary: "₹12,000 - ₹17,000",
        type: "Full-time",
        category: "Private",
        minQualification: "TENTH",
        requiredSkills: "Basic Communication, Hard Work",
        link: "https://reliance-retail.com/careers",
        deadline: new Date('2026-07-20')
    },
    {
        title: "Office Attendant",
        company: "Local Financial Services",
        description: "Manage office cleanliness, serve tea/coffee, and run office errands in a local setting.",
        location: "Tier 2 Cities",
        salary: "₹10,000 - ₹14,000",
        type: "Full-time",
        category: "Private",
        minQualification: "TENTH",
        requiredSkills: "Reliability, Cleanliness",
        link: "https://www.indeed.co.in",
        deadline: new Date('2026-05-15')
    },
    {
        title: "Field Sales Agent (Telecom)",
        company: "Jio / Airtel",
        description: "Visit local shops and customers to pitch mobile plans and internet services. Performance based.",
        location: "Local Area",
        salary: "₹12,000 + Incentives",
        type: "Full-time",
        category: "Private",
        minQualification: "TENTH",
        requiredSkills: "Persuasion, Traveling",
        link: "https://careers.jio.com",
        deadline: new Date('2026-06-30')
    },

    // --- 12TH PASS ---
    {
        title: "SSC CHSL (LDC/DEO)",
        company: "Staff Selection Commission",
        description: "Work as an LDC or Data Entry Operator in central government ministries. High growth path.",
        location: "Pan India",
        salary: "₹19,900 - ₹63,200",
        type: "Full-time",
        category: "Government",
        minQualification: "TWELFTH",
        requiredSkills: "Typing Speed, MS Office",
        link: "https://ssc.gov.in",
        deadline: new Date('2026-06-15')
    },
    {
        title: "Agniveer (General Duty/Clerk)",
        company: "Indian Army",
        description: "Serve in the Indian Army for 4 years under the Agnipath scheme. Disciplined career.",
        location: "Various Locations",
        salary: "₹30,000 - ₹40,000",
        type: "Full-time",
        category: "Government",
        minQualification: "TWELFTH",
        requiredSkills: "Physical Standards, Patriotism",
        link: "https://joinindianarmy.nic.in",
        deadline: new Date('2026-02-28')
    },
    {
        title: "Police Constable",
        company: "UP / Bihar State Police",
        description: "Maintain law and order in the state. Recruitment for thousands of posts annually.",
        location: "State Specific",
        salary: "₹21,700 - ₹35,000",
        type: "Full-time",
        category: "Government",
        minQualification: "TWELFTH",
        requiredSkills: "Endurance, Law Awareness",
        link: "https://uppbpb.gov.in",
        deadline: new Date('2026-03-20')
    },
    {
        title: "Assistant Loco Pilot (Trainee)",
        company: "Indian Railways",
        description: "Start your journey towards driving trains. Requires 12th PCM or ITI certification.",
        location: "Railway Zones",
        salary: "₹19,900 + Allowances",
        type: "Full-time",
        category: "Government",
        minQualification: "TWELFTH",
        requiredSkills: "Technical Mindset, Vision",
        link: "https://rrbapply.gov.in",
        deadline: new Date('2026-04-10')
    },
    {
        title: "Customer Support Executive",
        company: "Tech Mahindra / Wipro",
        description: "Provide support to international or domestic clients via voice or chat. 24/7 shifts.",
        location: "Pune / Noida / Remote",
        salary: "₹18,000 - ₹28,000",
        type: "Full-time",
        category: "Private",
        minQualification: "TWELFTH",
        requiredSkills: "Communication, Patience",
        link: "https://techmahindra.com/careers",
        deadline: new Date('2026-07-31')
    },
    {
        title: "Data Entry Operator",
        company: "Genpact / HCL Tech",
        description: "Back-office operations and data management for banking and healthcare clients.",
        location: "Major Cities",
        salary: "₹16,000 - ₹24,000",
        type: "Full-time",
        category: "Private",
        minQualification: "TWELFTH",
        requiredSkills: "Typing, Accuracy",
        link: "https://genpact.com/careers",
        deadline: new Date('2026-08-20')
    },
    {
        title: "Flight Cabin Crew (Trainee)",
        company: "Indigo / Air India Express",
        description: "Looking for grooming and hospitable candidates for ground staff and cabin crew roles.",
        location: "Major Airports",
        salary: "₹25,000 - ₹45,000",
        type: "Full-time",
        category: "Private",
        minQualification: "TWELFTH",
        requiredSkills: "Grooming, Hospitality",
        link: "https://goindigo.app.param.ai/jobs",
        deadline: new Date('2026-05-15')
    },
    {
        title: "Insurance Sales Advisor",
        company: "HDFC Life / LIC Agent",
        description: "Help clients choose life and health insurance plans. Performance based earnings.",
        location: "Home Based / Office",
        salary: "₹15,000 + Commisions",
        type: "Flexible",
        category: "Private",
        minQualification: "TWELFTH",
        requiredSkills: "Sales, Finance Basic",
        link: "https://hdfclife.com/careers",
        deadline: new Date('2026-10-10')
    },
    {
        title: "Hospitality Receptionist",
        company: "Taj Hotels / Marriott Group",
        description: "Manage check-ins, guest queries and front desk operations in luxury hotels.",
        location: "Tourist Destinations",
        salary: "₹20,000 - ₹30,000",
        type: "Full-time",
        category: "Private",
        minQualification: "TWELFTH",
        requiredSkills: "Presentation, Soft Skills",
        link: "https://marriott.com/careers",
        deadline: new Date('2026-06-30')
    },
    {
        title: "Junior Lab Assistant",
        company: "Diagnostic Centers / Hospitals",
        description: "Assist in sample collection and basic lab testing procedures under supervision.",
        location: "Local Clinics",
        salary: "₹14,000 - ₹18,000",
        type: "Full-time",
        category: "Private",
        minQualification: "TWELFTH",
        requiredSkills: "Science Background, Detail",
        link: "https://www.practo.com",
        deadline: new Date('2026-04-15')
    },

    // --- UG / PG PASS ---
    {
        title: "Software Engineer",
        company: "TCS / Infosys / Accenture",
        description: "Work on global projects as a developer. Technologies: Java, Python, React, Cloud.",
        location: "Bangalore / Hyderabad / Remote",
        salary: "₹3.5 LPA - ₹8.0 LPA",
        type: "Full-time",
        category: "Private",
        minQualification: "UG",
        requiredSkills: "Coding, Problem Solving",
        link: "https://infosys.com/careers",
        deadline: new Date('2026-11-30')
    },
    {
        title: "Management Trainee",
        company: "SBI PO / Bank PO",
        description: "Prestigious entry into banking. Manage branch operations and loans.",
        location: "Pan India",
        salary: "₹50,000 - ₹65,000",
        type: "Full-time",
        category: "Government",
        minQualification: "UG",
        requiredSkills: "Aptitude, Reasoning",
        link: "https://sbi.co.in/careers",
        deadline: new Date('2026-09-15')
    },
    {
        title: "Junior Engineer (Civil/Mechanical)",
        company: "SSC JE / CPWD",
        description: "Supervise construction and maintenance of central government infrastructure.",
        location: "Pan India",
        salary: "₹35,400 - ₹1,12,400",
        type: "Full-time",
        category: "Government",
        minQualification: "UG",
        requiredSkills: "Engineering Fundamentals",
        link: "https://ssc.gov.in",
        deadline: new Date('2026-08-10')
    },
    {
        title: "Business Development Associate",
        company: "Byju's / Unacademy",
        description: "Consultative sales for educational products. High growth and high targets.",
        location: "Pan India (Hybrid)",
        salary: "₹5 LPA + Incentives",
        type: "Full-time",
        category: "Private",
        minQualification: "UG",
        requiredSkills: "Communication, Sales",
        link: "https://byjus.com/careers",
        deadline: new Date('2026-10-15')
    },
    {
        title: "HR Executive",
        company: "Cognizant / Capgemini",
        description: "Handle recruitment, employee onboarding, and talent management operations.",
        location: "Chennai / Bangalore",
        salary: "₹25,000 - ₹40,000",
        type: "Full-time",
        category: "Private",
        minQualification: "UG",
        requiredSkills: "HR Compliance, Excel",
        link: "https://cognizant.com/careers",
        deadline: new Date('2026-07-20')
    },
    {
        title: "Assistant Professor (Trainee)",
        company: "State Technical Universities",
        description: "Lecture and assist in research. Requires NET/GATE or PG/PhD. Teaching focus.",
        location: "University Campus",
        salary: "₹57,700 (Level 10)",
        type: "Full-time",
        category: "Government",
        minQualification: "PG",
        requiredSkills: "Research, Presentation",
        link: "https://ugc.ac.in",
        deadline: new Date('2026-05-31')
    },
    {
        title: "Financial Analyst",
        company: "Goldman Sachs / JP Morgan",
        description: "Analyze market trends and assist in investment banking operations.",
        location: "Mumbai / Bangalore",
        salary: "₹8 LPA - ₹15 LPA",
        type: "Full-time",
        category: "Private",
        minQualification: "PG",
        requiredSkills: "Finance, Data Analytics",
        link: "https://jpmorganchase.com/careers",
        deadline: new Date('2026-12-15')
    },
    {
        title: "Staff Nurse / Health Officer",
        company: "AIIMS / State Health Dept",
        description: "Provide healthcare services in premier government hospitals. Critical care focus.",
        location: "Delhi / Bhopal / Patna",
        salary: "₹45,000 - ₹70,000",
        type: "Full-time",
        category: "Government",
        minQualification: "UG",
        requiredSkills: "Nursing, Patient Care",
        link: "https://aiims.edu",
        deadline: new Date('2026-06-25')
    },
    {
        title: "Digital Marketing Manager",
        company: "Nykaa / Zivame",
        description: "Lead SEO, SEM, and social media campaigns for leading e-commerce brands.",
        location: "Mumbai",
        salary: "₹6 LPA - ₹12 LPA",
        type: "Full-time",
        category: "Private",
        minQualification: "UG",
        requiredSkills: "Marketing Analytics, SEO",
        link: "https://nykaa.com/careers",
        deadline: new Date('2026-08-31')
    },
    {
        title: "Scientist - B (Entry Level)",
        company: "ISRO / DRDO",
        description: "Participate in space research and defense technology development. Top tier role.",
        location: "Various Centers",
        salary: "₹56,100 + Perquisites",
        type: "Full-time",
        category: "Government",
        minQualification: "UG",
        requiredSkills: "Scientific Temper, GATE Score",
        link: "https://isro.gov.in/careers",
        deadline: new Date('2026-03-31')
    }
];

async function main() {
    try {
        console.log("Seeding 30 realistic jobs...");
        let count = 0;
        for (const job of REALISTIC_JOBS) {
            const existing = await prisma.job.findFirst({
                where: {
                    title: job.title,
                    company: job.company
                }
            });

            if (!existing) {
                await prisma.job.create({ data: job });
                console.log(`✅ Created: ${job.title} at ${job.company}`);
                count++;
            } else {
                // Update to ensure realistic data
                await prisma.job.update({
                    where: { id: existing.id },
                    data: job
                });
                console.log(`🔄 Updated: ${job.title}`);
                count++;
            }
        }
        console.log(`Successfully processed ${count} jobs.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
