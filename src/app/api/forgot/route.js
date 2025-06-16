// FILE: src/app/api/forgot/route.js

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendPasswordResetEmail } from "@/lib/mailer";

export async function POST(req) {
  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  const db = (await clientPromise).db();
  const user = await db.collection("users").findOne({ email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const lastSent = user.resetLastSent ? new Date(user.resetLastSent) : null;
  const now = new Date();

  if (lastSent && now - lastSent < 30 * 24 * 60 * 60 * 1000) {
    return NextResponse.json({
      message:
        "A reset email has already been sent recently. Please check your inbox.",
    });
  }

  // Generate a secure email verification token
  const token = crypto.randomBytes(32).toString("hex");

  await sendPasswordResetEmail(email, token);

  await db
    .collection("users")
    .updateOne(
      { _id: user._id },
      { $set: { resetToken: token, resetLastSent: now } },
    );

  return NextResponse.json({ message: "Password reset email sent" });
}
