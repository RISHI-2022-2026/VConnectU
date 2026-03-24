import Link from "next/link";
import { ArrowRight, CheckCircle2, Award, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen text-slate-900 selection:bg-purple-100 selection:text-purple-600">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">
          VConnectU x Skillvouch AI
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-slate-500 hover:text-slate-900 font-bold transition-colors uppercase tracking-widest text-xs">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-200/30 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-10 relative z-10">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900">
            Show Your Skills. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500">
              Unlock Your Future.
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            The intelligent platform that connects your qualifications with the right opportunities.
            Upload credentials, get verified, and find your dream career path today.
          </p>

          <div className="flex justify-center gap-6 pt-10">
            <Link
              href="/register"
              className="group bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all flex items-center gap-3 shadow-2xl shadow-slate-200"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-40 relative z-10">
          {[
            {
              icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
              title: "Smart Verification",
              desc: "Automated qualification checks ensuring high-integrity, authentic professional profiles.",
            },
            {
              icon: <Award className="w-8 h-8 text-purple-600" />,
              title: "Skill Matching",
              desc: "AI-driven algorithms to precisely match your skill set with industry-standard roles.",
            },
            {
              icon: <BookOpen className="w-8 h-8 text-blue-600" />,
              title: "Learning Hub",
              desc: "Curated academic resources to bridge knowledge gaps and propel your professional growth.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-10 rounded-[2.5rem] bg-white/40 border border-white/60 hover:border-purple-300 hover:bg-white/80 transition-all backdrop-blur-xl group shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-purple-100"
            >
              <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-inner group-hover:scale-110 transition-transform border border-slate-50">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
