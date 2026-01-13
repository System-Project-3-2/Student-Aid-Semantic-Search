import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  // Always log OTP/email content for development purposes
  console.log(`\n========== EMAIL DEBUG ==========`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${text}`);
  console.log(`=================================\n`);

  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials not configured. Email not sent, but OTP logged above.");
    return; // Skip sending if not configured
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Must be 16-char App Password from Google Account
      },
    });

    const mailOptions = {
      from: `"Student Aid System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    // Log error but don't throw - allow registration to proceed
    console.error("Error sending email:", error.message);
    console.warn("Email failed, but OTP was logged above. Use the logged OTP to verify.");
    // Don't throw - let the registration continue
  }
};
