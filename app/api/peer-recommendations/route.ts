import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skillsToLearn } = await request.json();
    const userId = session.userId as string;
    
    console.log('🔍 Peer recommendation request:', { userId, skillsToLearn });
    
    if (!skillsToLearn || !Array.isArray(skillsToLearn)) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const results: any[] = [];
    
    // Fetch all other users to find matches
    const allUsers = await prisma.user.findMany({
      where: {
          id: { not: userId },
      },
      select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          rating: true,
          skillsKnown: true,
          skillsToLearn: true,
          learningHours: true,
          weeklyActivity: true
      }
    });

    for (const skill of skillsToLearn) {
      console.log(`🔍 Searching for users with verified ${skill}...`);
      
      let matchedUsers = allUsers.filter(user => {
        try {
          const skills = JSON.parse(user.skillsKnown || '[]');
          return skills.some((s: any) => s.name.toLowerCase() === skill.toLowerCase() && s.verified === true);
        } catch (e) {
          return false;
        }
      });
      
      // If no verified users found, look for ANY users with this skill
      if (matchedUsers.length === 0) {
        console.log(`⚠️ No verified users for ${skill}, checking unverified...`);
        matchedUsers = allUsers.filter(user => {
          try {
            const skills = JSON.parse(user.skillsKnown || '[]');
            return skills.some((s: any) => s.name.toLowerCase() === skill.toLowerCase());
          } catch (e) {
            return false;
          }
        });
      }
      
      console.log(`📊 Found ${matchedUsers.length} users with ${skill}`);
      
      for (const user of matchedUsers) {
        // Parse skills to get exact skill details
        const skillsKnownParsed = JSON.parse(user.skillsKnown || '[]');
        const skillsToLearnParsed = JSON.parse(user.skillsToLearn || '[]');
        // Prefer verified, but take unverified if that's all we have
        const verifiedSkill = skillsKnownParsed.find((s: any) => s.name.toLowerCase() === skill.toLowerCase() && s.verified === true) || 
                             skillsKnownParsed.find((s: any) => s.name.toLowerCase() === skill.toLowerCase());
        
        if (verifiedSkill) {
          console.log(`✅ Match: ${user.name} has verified ${skill}`);
          
          // Check if user already added
          if (!results.find(r => r.id === user.id)) {
            results.push({
              id: user.id,
              name: user.name,
              email: user.email,
              bio: user.bio || "",
              avatar: "",
              rating: user.rating,
              learningHours: user.learningHours || 0,
              weeklyActivity: user.weeklyActivity || 0,
              skillsKnown: skillsKnownParsed,
              skillsToLearn: skillsToLearnParsed
            });
          }
        }
      }
    }

    console.log(`🎯 Total unique matches: ${results.length}`);
    console.log('📋 Final results:', results.map(p => p.name));

    // Sort by rating
    results.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({
      requestedSkills: skillsToLearn,
      verifiedPeers: results.slice(0, 5),
      message: results.length > 0 
        ? `${results.length} verified peers found.`
        : 'No verified peers are currently available for requested skills.'
    });

  } catch (err) {
    console.error('❌ Peer recommendations error:', err);
    return NextResponse.json({ error: 'Failed to get peer recommendations' }, { status: 500 });
  }
}
