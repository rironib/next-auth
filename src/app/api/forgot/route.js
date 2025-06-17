import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendPasswordResetEmail } from "@/lib/mailer";
import crypto from "node:crypto";

export async function POST(req) {
  const { email, token } = await req.json();

  if (!email || !token) {
    return NextResponse.json(
      { error: "Email and captcha token are required." },
      { status: 400 },
    );
  }

  // 🔐 Verify reCAPTCHA token
  const captchaRes = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    },
  );

  const captchaData = await captchaRes.json();
  if (!captchaData.success) {
    return NextResponse.json(
      { error: "Captcha verification failed. Try again." },
      { status: 403 },
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const db = (await clientPromise).db();
  const user = await db
    .collection("users")
    .findOne({ email: { $regex: `^${normalizedEmail}$`, $options: "i" } });

  if (!user) {
    return NextResponse.json(
      { error: "No account is associated with this email." },
      { status: 404 },
    );
  }

  const lastSent = user.resetLastSent ? new Date(user.resetLastSent) : null;
  const now = new Date();

  // 30-day cooldown on reset requests
  if (lastSent && now - lastSent < 30 * 24 * 60 * 60 * 1000) {
    return NextResponse.json({
      message:
        "A reset email has already been sent recently. Please check your inbox.",
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Send reset email
  await sendPasswordResetEmail(email, resetToken);

  // Update user with new token and timestamp
  await db.collection("users").updateOne(
    { _id: user._id },
    {
      $set: {
        resetToken,
        resetLastSent: now,
      },
    },
  );

  return NextResponse.json({ message: "Password reset email sent." });
}
