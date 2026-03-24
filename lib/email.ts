import nodemailer from 'nodemailer';

export async function sendResetPasswordEmail(email: string, resetUrl: string) {
    // We'll use a test account for now. In production, use real SMTP credentials.
    // For development, we can use ethereal.email or a simple console log if SMTP is not available.

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER || 'ethereal_user',
            pass: process.env.EMAIL_PASS || 'ethereal_pass',
        },
    });

    const mailOptions = {
        from: '"VConnectU x Skillvouch AI Support" <support@vconnectu.com>',
        to: email,
        subject: "Reset Your Password - VConnectU x Skillvouch AI",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; rounded-lg">
        <h2 style="color: #4a148c; text-align: center;">VConnectU x Skillvouch AI</h2>
        <p>Hi,</p>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4a148c; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>The link will expire in 1 hour.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">VConnectU x Skillvouch AI - Connecting Professionals</p>
      </div>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);
        // Preview URL for ethereal.email
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
        console.error("Error sending email:", error);
        // In case of error (like no credentials), log the URL to console at least
        console.log("CRITICAL: SMTP failed. RESET URL IS:", resetUrl);
        return { success: false, error: "Failed to send email" };
    }
}
