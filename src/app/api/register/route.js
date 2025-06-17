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

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const db = (await clientPromise).db();
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({
      $or: [
        { email: { $regex: `^${normalizedEmail}$`, $options: "i" } },
        { username: { $regex: `^${normalizedUsername}$`, $options: "i" } },
      ],
    });
    if (existingUser) {
      let message = "An account with the provided credentials already exists.";

      if (
        existingUser.email.toLowerCase() === normalizedEmail &&
        existingUser.username.toLowerCase() === normalizedUsername
      ) {
        message =
          "Both the email address and username are already associated with existing accounts.";
      } else if (existingUser.email.toLowerCase() === normalizedEmail) {
        message = "The email address you entered is already registered.";
      } else if (existingUser.username.toLowerCase() === normalizedUsername) {
        message = "The username you selected is already taken.";
      }

      return Response.json({ error: message }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Generate a secure email verification token
    const token = crypto.randomBytes(32).toString("hex");

    // Insert new user
    await users.insertOne({
      name,
      username: normalizedUsername,
      gender,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
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
