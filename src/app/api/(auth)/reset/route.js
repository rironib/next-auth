// FILE: src/app/api/reset/route.js

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcrypt";

// Password strength checker
function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(password);
}

export async function POST(req) {
  try {
    const { token, newPassword, captchaToken } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "A valid token and new password are required to proceed." },
        { status: 400 },
      );
    }

    if (!isStrongPassword(newPassword)) {
      return NextResponse.json(
        {
          error:
            "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.",
        },
        { status: 400 },
      );
    }

    if (!captchaToken) {
      return NextResponse.json(
        { error: "Captcha verification is required." },
        { status: 400 },
      );
    }

    // 🔐 Verify Cloudflare Turnstile token
    const captchaRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: captchaToken,
        }),
      },
    );

    const captchaData = await captchaRes.json();
    if (!captchaData.success) {
      return NextResponse.json(
        {
          error:
            "Captcha verification was unsuccessful. Please refresh the page and try again.",
        },
        { status: 403 },
      );
    }

    const db = (await clientPromise).db();
    const users = db.collection("users");

    // Find user by reset token
    const user = await users.findOne({ resetToken: token });

    if (
      !user ||
      !user.resetTokenExpiry ||
      new Date(user.resetTokenExpiry) < new Date()
    ) {
      return NextResponse.json(
        { error: "The provided token is invalid or has expired." },
        { status: 404 },
      );
    }

    const hashedPassword = await hash(newPassword, 10);

    // Update user with new password and reset token
    await users.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword }, $unset: { resetToken: "" } },
    );

    return NextResponse.json({
      message: "Your password has been reset successfully.",
    });
  } catch (err) {
    console.error("Password reset error:", err);
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while resetting your password. Please try again later.",
      },
      { status: 500 },
    );
  }
}
