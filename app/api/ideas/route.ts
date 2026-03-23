import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, problem, solution, technologies, impact, contactEmail, contactPhone } = body;

        if (!title || !problem || !solution || !contactEmail || !contactPhone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const idea = await prisma.idea.create({
            data: {
                title,
                problem,
                solution,
                technologies,
                impact,
                contactEmail,
                contactPhone,
                userId: session.userId as string
            }
        });

        return NextResponse.json(idea);
    } catch (error: any) {
        console.error("Error creating idea:", error);
        return NextResponse.json({ error: error.message || "Failed to create idea" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        // If no session, they shouldn't see anything or handle accordingly
        // For now, let's assume they must be logged in.

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";

        // If no query is provided, maybe we don't show any ideas to match "dont show the users idea"
        // but let's see. If the user meant "hide items by default", query === "" should return []
        if (!query && !process.env.SHOW_ALL_IDEAS) {
            // return NextResponse.json([]); // Uncomment if we want to hide everything by default
        }

        const ideas = await prisma.idea.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { title: { contains: query } },
                            { problem: { contains: query } },
                            { solution: { contains: query } },
                            { technologies: { contains: query } }
                        ]
                    },
                    // Filtering logic:
                    // If session exists, and user is NOT HR, exclude their own ideas
                    ...(session ? [{
                        NOT: {
                            userId: session.userId as string
                        }
                    }] : [])
                ]
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // If the user's role is HR, they should see everything.
        // Wait, the filter above excludes the user's own ideas regardless of role.
        // Let's refine it: only exclude if role is NOT HR.

        // Revised query with role check:
        let whereClause: any = {
            OR: [
                { title: { contains: query } },
                { problem: { contains: query } },
                { solution: { contains: query } },
                { technologies: { contains: query } }
            ]
        };

        if (session) {
            const user = await prisma.user.findUnique({
                where: { id: session.userId as string },
                select: { role: true }
            });

            if (user?.role !== "HR") {
                whereClause = {
                    AND: [
                        whereClause,
                        { userId: { not: session.userId as string } }
                    ]
                };
            }
        }

        const filteredIdeas = await prisma.idea.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(filteredIdeas);
    } catch (error: any) {
        console.error("Error fetching ideas:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch ideas" }, { status: 500 });
    }
}
