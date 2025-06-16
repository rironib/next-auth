// FILE: src/app/api/register/route.js

import { hash } from "bcrypt";
import crypto from "node:crypto";
import { sendVerificationEmail } from "@/lib/mailer";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { name, username, gender, email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const db = (await clientPromise).db();
    const users = db.collection("users");

    // Check if user already exists
    const existing = await users.findOne({ email });
    if (existing) {
      return Response.json({ error: "Email already in use" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Generate a secure email verification token
    const token = crypto.randomBytes(32).toString("hex");

    // Insert new user
    await users.insertOne({
      name,
      username,
      gender,
      email,
      hashedPassword,
      emailVerified: null,
      verifyToken: token,
      createdAt: new Date(),
    });

    // Send email verification
    await sendVerificationEmail(email, token);

    return Response.json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
