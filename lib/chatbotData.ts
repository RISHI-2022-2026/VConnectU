export interface ChatIntent {
    id: string;
    keywords: string[];
    response: string;
    category: "jobs" | "interview" | "resume" | "competitions" | "profile" | "general";
}

export const CHAT_KNOWLEDGE_BASE: ChatIntent[] = [
    // --- JOBS ---
    {
        id: "job_search",
        keywords: ["job", "jobs", "vacancy", "vacancies", "career", "hiring", "opportunities"],
        response: "You can explore the latest opportunities in the 'Jobs' section of your dashboard. We list both private sector roles and government vacancies tailored to your profile.",
        category: "jobs"
    },
    {
        id: "job_apply",
        keywords: ["apply", "application"],
        response: "To apply, simply click on a job card in the 'Jobs' tab. You'll see a 'Quick Apply' button. Ensure your profile and resume are up-to-date for the best chance of success!",
        category: "jobs"
    },
    {
        id: "job_withdraw",
        keywords: ["withdraw", "cancel application"],
        response: "You can manage your applications in the 'My Applications' tab. If you wish to withdraw, simply locate the job and click the 'Withdraw' button.",
        category: "jobs"
    },

    // --- MOCK INTERVIEW ---
    {
        id: "mock_interview_info",
        keywords: ["mock interview", "practice interview", "simulation"],
        response: "Our AI Mock Interview feature simulates a real interview experience. It analyzes your resume to ask tailored technical questions, followed by a standard HR round.",
        category: "interview"
    },
    {
        id: "mock_interview_start",
        keywords: ["start interview", "begin interview", "take interview"],
        response: "Go to your dashboard home and click the red 'AI Mock Interview' card. Upload your resume, check your camera/mic, and you're ready to start!",
        category: "interview"
    },

    // --- RESUME ---
    {
        id: "resume_score",
        keywords: ["resume score", "ats score", "check resume", "analyze resume"],
        response: "Use our 'Resume Analyzer' tool on the dashboard. It checks your resume against ATS standards, gives you a score out of 100, and suggests keywords to improve it.",
        category: "resume"
    },
    {
        id: "resume_upload",
        keywords: ["upload resume", "update resume", "change resume"],
        response: "You can upload or update your resume in your 'Profile' settings. Keeping it current helps our AI match you with the right jobs and interview questions.",
        category: "resume"
    },

    // --- COMPETITIONS ---
    {
        id: "competitions_info",
        keywords: ["competition", "hackathon", "contest", "challenge"],
        response: "Check out the 'Competitions' tab! We host regular coding challenges and hackathons. Participating is a great way to showcase your skills to potential recruiters.",
        category: "competitions"
    },

    // --- PROFILE ---
    {
        id: "profile_update",
        keywords: ["edit profile", "update profile", "change details"],
        response: "Click on your avatar in the top right corner and select 'Profile'. There you can update your education, skills, and personal details.",
        category: "profile"
    },

    // --- GENERAL ---
    {
        id: "greeting",
        keywords: ["hello", "hi", "hey", "greetings", "good morning", "good evening"],
        response: "Hello! I'm your VConnectU x Skillvouch AI Assistant. How can I help you navigate the platform today?",
        category: "general"
    },
    {
        id: "help",
        keywords: ["help", "support", "assist", "confused"],
        response: "I'm here to help! You can ask me about finding jobs, preparing for interviews, analyzing your resume, or participating in competitions.",
        category: "general"
    },
    {
        id: "about_platform",
        keywords: ["what is vconnectu", "what is skillvouch", "skillvouch ai", "about platform", "what do you do"],
        response: "VConnectU x Skillvouch AI is a comprehensive career platform designed to bridge the gap between talent and opportunity. We offer job listings, AI-driven interview prep, resume analysis, and skill-building competitions.",
        category: "general"
    }
];
