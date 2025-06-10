// src/config/nextAuth.js

import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // ✅ Use stateless sessions
  },
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "SiteLike",
  }),
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // On first login, add user.id to token
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      // Add token.id to session for client access
      if (token) session.user.id = token.id;
      return session;
    },
  },
};
