// FILE: src/app/api/reset/route.js

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { token, newPassword } = await req.json();
  if (!token || !newPassword)
    return NextResponse.json(
      { error: "Token and new password required" },
      { status: 400 },
    );

  const db = (await clientPromise).db();
  const user = await db.collection("users").findOne({ resetToken: token });
  if (!user)
    return NextResponse.json(
      { error: "Invalid or already used token" },
      { status: 400 },
    );

  const hashed = await bcrypt.hash(newPassword, 10);

  await db
    .collection("users")
    .updateOne(
      { _id: user._id },
      { $set: { password: hashed }, $unset: { resetToken: "" } },
    );

  return NextResponse.json({ message: "Password reset successful" });
}
