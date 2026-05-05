import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const sendMail = async (to, otp, subject = "Reset Your Password", customHtml = null) => {
  try {
    const htmlContent = customHtml || `
        <p>Your OTP is: <b>${otp}</b></p>
        <p>This OTP will expire in <b>5 minutes</b>.</p>
      `;

    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log("Email Sent Successfully");
  } catch (error) {
    console.log("Email Error:", error);
    throw new Error("Email service failed to send OTP. Please check your configuration.");
  }
};

export default sendMail;
