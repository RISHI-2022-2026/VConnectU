import { NextResponse } from "next/server";
import { generateQuiz } from "@/lib/ai/mistralQuiz";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skill, difficulty } = await request.json();

    if (!skill || typeof skill !== 'string') {
      return NextResponse.json({ error: 'skill is required and must be a string' }, { status: 400 });
    }

    if (!difficulty || typeof difficulty !== 'string') {
      return NextResponse.json({ error: 'difficulty is required and must be a string' }, { status: 400 });
    }

    const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json({ error: 'difficulty must be one of: beginner, intermediate, advanced, expert' }, { status: 400 });
    }

    const questions = await generateQuiz(skill, difficulty, 10);
    
    // Convert to frontend format with correctAnswerIndex
    const formattedQuestions = questions.map((q: any) => ({
      question: q.question,
      codeSnippet: q.codeSnippet || '',
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex ?? q.options.indexOf(q.correctAnswer)
    }));

    // Optional: save quiz to db if not already present
    try {
        await prisma.skillQuiz.upsert({
            where: {
                userId_skillName: { userId: session.userId as string, skillName: skill }
            },
            update: {
                questions: JSON.stringify(formattedQuestions),
                difficulty
            },
            create: {
                userId: session.userId as string,
                skillName: skill,
                difficulty,
                questions: JSON.stringify(formattedQuestions)
            }
        });
    } catch(dbErr) {
        console.error("Failed to save quiz to DB", dbErr);
    }

    return NextResponse.json({ questions: formattedQuestions });

  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz', details: error.message }, { status: 500 });
  }
}
