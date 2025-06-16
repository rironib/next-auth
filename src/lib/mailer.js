import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email",
    html: `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
  });
};
