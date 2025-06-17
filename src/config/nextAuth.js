// FILE: src/config/nextAuth.js

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcrypt";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const input = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");

        const user = await users.findOne({
          $or: [
            { email: { $regex: `^${input}$`, $options: "i" } },
            { username: { $regex: `^${input}$`, $options: "i" } },
          ],
        });

        if (!user || !user.password) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        if (!user.emailVerified) {
          throw new Error(
            "Please verify your email address before logging in.",
          );
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
