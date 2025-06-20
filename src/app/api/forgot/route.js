// src/app/api/forgot/route.js

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendPasswordResetEmail } from "@/lib/mailer";
import crypto from "node:crypto";

// Email validation regex
function isValidEmail(email) {
  return /^[a-zA-Z0-9._%\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);
}

export async function POST(req) {
  try {
    const { email, captchaToken } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Please provide a valid email address to continue." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error: "Enter a valid email address.",
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

    const normalizedEmail = email.trim().toLowerCase();

    const db = (await clientPromise).db();
    const users = db.collection("users");

    // Check if a User exists with the provided email
    const user = await users.findOne({
      email: { $regex: `^${normalizedEmail}$`, $options: "i" },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "No account was found associated with the provided email address.",
        },
        { status: 404 },
      );
    }

    const lastSent = user.resetLastSent ? new Date(user.resetLastSent) : null;
    const now = new Date();

    // 30-day cooldown on reset requests
    if (lastSent && now - lastSent < 30 * 24 * 60 * 60 * 1000) {
      const cooldownEnd = new Date(
        lastSent.getTime() + 30 * 24 * 60 * 60 * 1000,
      );
      const msRemaining = cooldownEnd - now;
      const days = Math.floor(msRemaining / (24 * 60 * 60 * 1000));
      const hours = Math.floor(
        (msRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
      );
      const minutes = Math.floor(
        (msRemaining % (60 * 60 * 1000)) / (60 * 1000),
      );

      return NextResponse.json(
        {
          error: `Please try again in ${days} day(s), ${hours} hour(s), and ${minutes} minute(s).`,
        },
        { status: 429 },
      );
    }

    // Generate reset token and expiry (24 hours from now)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    // Update user with new token and timestamp
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
          resetLastSent: now,
        },
      },
    );

    return NextResponse.json({
      message: "A password reset email has been sent to your address.",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while processing your request. Please try again later.",
      },
      { status: 500 },
    );
  }
}
