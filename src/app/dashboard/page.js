"use client";
import { signOut, useSession } from "next-auth/react";
import { Button, Card, Spinner } from "@heroui/react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Spinner />;

  if (!session) return redirect("/auth/login");

  return (
    <main className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md px-3 py-6 sm:p-4 md:p-6 md:py-8 lg:p-8">
        <h2 className="mb-4 text-center text-2xl font-bold">Dashboard</h2>
        <div className="space-y-4 text-center">
          <div>
            <p>Welcome, {session.user.name}</p>
            <p>Email: {session.user.email}</p>
          </div>
          <Button
            size="lg"
            variant="flat"
            color="danger"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </div>
      </Card>
    </main>
  );
}
