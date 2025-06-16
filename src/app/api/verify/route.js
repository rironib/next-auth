import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json({ error: "Missing token" }, { status: 400 });
  }

  const db = (await clientPromise).db();
  const user = await db.collection("users").findOne({ verifyToken: token });

  if (!user || user.verifyTokenExpires < new Date()) {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 400 },
    );
  }

  await db.collection("users").updateOne(
    { _id: user._id },
    {
      $set: { emailVerified: new Date() },
      $unset: { verifyToken: "", verifyTokenExpires: "" },
    },
  );

  return Response.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?verified=true`,
  );
}
