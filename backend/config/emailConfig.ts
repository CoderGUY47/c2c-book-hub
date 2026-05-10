import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Gmail configuration is not ready to send the mail");
  } else {
    console.log("Gmail configuration is ready to send the mail");
  }
});

const sendEmail = async (to: string, subject: string, body: string) => {
  await transporter.sendMail({
    from: `"Your Book-Hub" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: body,
  });
};

// Send verification email
export const sendVerificationToEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = `
    <h1 className="text-2xl font-bold font-poppins">Welcome to Book-Hub. And Verify your email, now!</h1>
    <p className="font-medium font-poppins">Thanks for registering. Please click the link below to verify your email address:</p>
    <a className="font-semibold font-poppins" href="${verificationUrl}">Now, Verify your email!</a>
    <p classNAme="font-medium">If you didn't register or verify for this account, please ignore this email.</p>
    `;
  await sendEmail(to, "Please, Verify your email.", html);
};

//reseting passwrod

export const sendResetPasswordLinkToEmail = async (
  to: string,
  token: string,
) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `
    <h1>Welcome to Book-Hub. Reset your password!</h1>
    <p>Thanks for registering. Please click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset your password</a>
    <p>If you didn't register or verify for this account, please ignore this email and <strong>your password will remain unchanged</strong>.</p>
    `;
  await sendEmail(to, "Please, Reset your password.", html);
};

// Send OTP for login verification
export const sendOtpToEmail = async (to: string, otp: string, name: string) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your OTP Code</title>
</head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1e1b4b,#1e1040);border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;letter-spacing:1px;">📚 OxPecker BookHub</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Campus Book Exchange Platform</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#a5b4fc;font-size:15px;margin:0 0 8px;">Hello, <strong style="color:#e0e7ff;">${name}</strong> 👋</p>
              <p style="color:#c7d2fe;font-size:15px;margin:0 0 28px;line-height:1.6;">
                Use the OTP below to verify your identity on <strong style="color:#818cf8;">OxPecker BookHub</strong>. 
                This code is valid for <strong style="color:#f59e0b;">10 minutes</strong>.
              </p>
              <!-- OTP Box -->
              <div style="background:linear-gradient(135deg,#312e81,#4c1d95);border-radius:16px;padding:32px;text-align:center;margin:0 0 28px;border:1px solid rgba(99,102,241,0.3);">
                <p style="color:#a5b4fc;font-size:12px;text-transform:uppercase;letter-spacing:3px;margin:0 0 12px;">Your OTP Code</p>
                <div style="background:#fff;border-radius:12px;padding:16px 24px;display:inline-block;">
                  <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:#4f46e5;font-family:'Courier New',monospace;">${otp}</span>
                </div>
                <p style="color:#818cf8;font-size:12px;margin:16px 0 0;">Do not share this code with anyone.</p>
              </div>
              <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">
                If you did not request this OTP, please ignore this email. Your account is safe.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0f0f1a;padding:20px 40px;text-align:center;border-top:1px solid rgba(99,102,241,0.2);">
              <p style="color:#374151;font-size:12px;margin:0;">© 2026 OxPecker BookHub · Campus Book Exchange · All rights reserved</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
  await sendEmail(to, "🔐 Your OxPecker BookHub OTP Code", html);
};
