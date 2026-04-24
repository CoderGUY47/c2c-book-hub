import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
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



const sendEmail =async(to:string, subject:string, body:string)=>{
    await transporter.sendMail({
        from: `"Your Book-shop" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: body,
    });
}


// Send verification email
export const sendVerificationToEmail = async(to:string, token:string)=>{
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`; 
    const html =`
    <h1 className="text-2xl font-bold font-poppins">Welcome to Book-Shop. And Verify your email, now!</h1>
    <p className="font-medium font-poppins">Thanks for registering. Please click the link below to verify your email address:</p>
    <a className="font-semibold font-poppins" href="${verificationUrl}">Now, Verify your email!</a>
    <p classNAme="font-medium">If you didn't register or verify for this account, please ignore this email.</p>
    `
    await sendEmail(to, "Please, Verify your email.", html);
}



//reseting passwrod

export const sendResetPasswordLinkToEmail = async(to:string, token:string)=>{
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`; 
    const html =`
    <h1>Welcome to Book-Shop. Reset your password!</h1>
    <p>Thanks for registering. Please click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset your password</a>
    <p>If you didn't register or verify for this account, please ignore this email and <strong>your password will remain unchanged</strong>.</p>
    `
    await sendEmail(to, "Please, Reset your password.", html);
}