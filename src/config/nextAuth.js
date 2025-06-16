// src/config/nextAuth.js

import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });

        if (!user || !user.hashedPassword) {
          throw new Error("User not found or no password set");
        }

        const isValid = await compare(
          credentials.password,
          user.hashedPassword,
        );
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        if (!user.emailVerified) {
          throw new Error("Email not verified");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Skip check for EmailProvider (magic link does verification)
      if (account.provider === "email") return true;

      // Fetch user from DB to check `emailVerified`
      const client = await clientPromise;
      const db = client.db();
      const dbUser = await db
        .collection("users")
        .findOne({ email: user.email });

      if (!dbUser?.emailVerified) {
        throw new Error("Email not verified");
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error", // optional error page for rejected login
  },
};
