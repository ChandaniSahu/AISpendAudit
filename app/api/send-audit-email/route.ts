import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            email,
            shareableLink,
            totalMonthlySavings,
            totalAnnualSavings,
        } = body;

        if (!email || !shareableLink) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const isHighSavings = totalMonthlySavings > 500;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your AI Spend Audit is Ready ✅',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #111827;">Your AI Spend Audit is Ready ✅</h2>
          
          <p style="font-size: 16px; color: #374151;">Hi ,</p>
          
          <p style="font-size: 16px; color: #374151;">Your AI spend audit is complete.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 15px; margin: 20px 0;">
  <p style="margin: 0; font-size: 16px; font-weight: 600; color: #166534;">
    ${totalMonthlySavings === 0
                    ? "✅ Your AI stack is already well-optimized! No major savings opportunities found."
                    : `💰 Potential Savings: ₹${totalMonthlySavings?.toLocaleString() || "0"}/month (₹${totalAnnualSavings?.toLocaleString() || "0"}/year)`
                }
  </p>
</div>
          
          <p style="text-align: center; margin: 25px 0;">
            <a href="${shareableLink}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              🔗 View Your Full Report
            </a>
          </p>
          
          ${isHighSavings ? `
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; font-size: 14px; color: #92400e;">
              Our team at Credex will reach out shortly to help you capture these savings more efficiently.
            </div>
          ` : ""}
          
          <br>
          <p style="font-size: 14px; color: #6b7280;">
            Thanks,<br>
            AI Spend Audit Team
          </p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { success: true, message: "Email sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Email send error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to send email" },
            { status: 500 }
        );
    }
}