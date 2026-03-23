import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendResetPasswordEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // For security reasons, don't reveal if the email exists or not
            return NextResponse.json({ success: true, message: "If an account exists with this email, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        await sendResetPasswordEmail(email, resetUrl);

        return NextResponse.json({ success: true, message: "If an account exists with this email, a reset link has been sent." });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
