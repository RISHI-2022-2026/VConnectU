import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const competitions = await prisma.competition.findMany({
            orderBy: {
                deadline: 'asc'
            }
        });
        return NextResponse.json(competitions);
    } catch (error) {
        console.error("Error fetching competitions:", error);
        return NextResponse.json({ error: "Failed to fetch competitions" }, { status: 500 });
    }
}
