import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    const mockUsers = [
      {
        name: "Alice Chef",
        email: "alice@example.com",
        bio: "Expert in Italian and French cuisine. Verified Food Photography skills.",
        rating: 4.8,
        skillsKnown: JSON.stringify([
          { name: "Cooking", verified: true, score: 95, id: "c1" },
          { name: "Food Photography", verified: true, score: 92, id: "c2" }
        ]),
        skillsToLearn: JSON.stringify(["Machine Learning", "Python"]),
        learningHours: 120,
        weeklyActivity: 15
      },
      {
        name: "Bob DataScientist",
        email: "bob@example.com",
        bio: "Deep learning enthusiast. Wants to learn cooking.",
        rating: 4.5,
        skillsKnown: JSON.stringify([
          { name: "Python", verified: true, score: 98, id: "b1" },
          { name: "Machine Learning", verified: true, score: 94, id: "b2" }
        ]),
        skillsToLearn: JSON.stringify(["Cooking", "Baking"]),
        learningHours: 200,
        weeklyActivity: 20
      },
      {
        name: "Charlie Baker",
        email: "charlie@example.com",
        bio: "Professional baker. Looking for data analysis tips.",
        rating: 4.2,
        skillsKnown: JSON.stringify([
            { name: "Baking", verified: true, score: 88, id: "ch1" },
            { name: "Cooking", verified: true, score: 85, id: "ch2" }
        ]),
        skillsToLearn: JSON.stringify(["Excel", "Python"]),
        learningHours: 50,
        weeklyActivity: 5
      }
    ];

    for (const user of mockUsers) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: user,
        create: {
            ...user,
            password: "hashed_password_here" // Dummy
        }
      });
    }

    return NextResponse.json({ message: "Mock users seeded successfully" });
  } catch (error) {
    console.error("Error seeding mock users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
