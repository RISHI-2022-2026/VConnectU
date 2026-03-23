import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user1, user2 } = await request.json();
    if (!user1 || !user2) return NextResponse.json({ error: 'user1 and user2 are required' }, { status: 400 });

    const commonSkills = (user1.skillsKnown || []).filter((skill: any) => 
      (user2.skillsToLearn || []).includes(skill.name || skill)
    );
    
    const reverseMatch = (user2.skillsKnown || []).filter((skill: any) => 
      (user1.skillsToLearn || []).includes(skill.name || skill)
    );

    const score = Math.min(95, (commonSkills.length + reverseMatch.length) * 20 + Math.random() * 15);
    const commonInterests = Array.from(new Set([
      ...commonSkills.map((s: any) => s.name || s),
      ...reverseMatch.map((s: any) => s.name || s)
    ]));

    const reasoning = `Good match based on ${commonSkills.length} skills user1 has that user2 wants to learn and ${reverseMatch.length} skills user2 has that user1 wants to learn. Both users have complementary learning goals.`;

    return NextResponse.json({
      score: Math.round(score),
      reasoning,
      commonInterests
    });
  } catch (error: any) {
    console.error('POST /api/match/analyze error', error);
    return NextResponse.json({ error: 'Failed to analyze match', details: error.message }, { status: 500 });
  }
}
