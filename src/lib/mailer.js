import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_SENDER_EMAIL;

const generateEmailHTML = (heading, message, buttonText, url) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>${heading}</h2>
    <p>${message}</p>
    <a href="${url}" style="display:inline-block; margin-top:15px; padding:10px 20px; background-color:#0070f3; color:#fff; text-decoration:none; border-radius:5px;">
      ${buttonText}
    </a>
    <p style="margin-top:20px; color:#666; font-size:12px;">If you didn’t request this, you can safely ignore this email.</p>
  </div>
`;

export async function sendVerificationEmail(email, token) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: generateEmailHTML(
        "Verify your email address",
        "Thanks for signing up. Please click the button below to verify your email address.",
        "Verify Email",
        url,
      ),
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Email send failed");
  }
}

export async function sendPasswordResetEmail(email, token) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: generateEmailHTML(
        "Reset your password",
        "You requested a password reset. Click the button below to continue.",
        "Reset Password",
        url,
      ),
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Email send failed");
  }
}
