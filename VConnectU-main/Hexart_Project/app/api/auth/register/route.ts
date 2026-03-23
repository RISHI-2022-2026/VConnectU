import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { name, email, password, phone } = await request.json();

        if (!name || !email || !password || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
            },
        });

        await createSession(user.id);

        return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Registration error details:", error);
        return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 });
    }
}
