// FILE: src/app/api/register/route.js

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendVerificationEmail } from "@/lib/mailer";
import { hash } from "bcrypt";
import crypto from "node:crypto";

// Password strength checker
function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(password);
}

// Email validation regex
function isValidEmail(email) {
  return /^[a-zA-Z0-9._%\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);
}

export async function POST(req) {
  try {
    const { name, username, email, password, captchaToken } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.",
        },
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
        { error: "Captcha token is required" },
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
    const normalizedUsername = username.trim().toLowerCase();

    const db = (await clientPromise).db();
    const users = db.collection("users");

    // Check if a User already exists
    const user = await users.findOne({
      $or: [
        { email: { $regex: `^${normalizedEmail}$`, $options: "i" } },
        { username: { $regex: `^${normalizedUsername}$`, $options: "i" } },
      ],
    });
    if (user) {
      let message = "An account with the provided credentials already exists.";

      if (
        user.email.toLowerCase() === normalizedEmail &&
        user.username.toLowerCase() === normalizedUsername
      ) {
        message =
          "Both the email address and username are already associated with existing accounts.";
      } else if (user.email.toLowerCase() === normalizedEmail) {
        message = "The email address you entered is already registered.";
      } else if (user.username.toLowerCase() === normalizedUsername) {
        message = "The username you selected is already taken.";
      }

      return NextResponse.json({ error: message }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Generate a secure email verification token
    const token = crypto.randomBytes(32).toString("hex");

    // Send email verification
    await sendVerificationEmail(email, token);

    // Insert new user
    await users.insertOne({
      name,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      emailVerified: null,
      verifyToken: token,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Something went wrong to register." },
      { status: 500 },
    );
  }
}
