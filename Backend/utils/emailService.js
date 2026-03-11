const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"SkillTree" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your Email - SkillTree",
    html: `
      <h2>Welcome to SkillTree!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
      <p>If you did not create an account, please ignore this email.</p>
    `,
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"SkillTree" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your Password - SkillTree",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
