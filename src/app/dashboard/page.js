"use client";
import { signOut, useSession } from "next-auth/react";
import { Spinner } from "@heroui/react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Spinner />;

  if (!session) return redirect("/auth/login");

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </main>
  );
}
