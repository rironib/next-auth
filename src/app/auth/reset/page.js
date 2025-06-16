// FILE: src/app/auth/reset/page.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, Input } from "@heroui/react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });
    const data = await res.json();
    if (!res.ok) toast.error(data.error || "Reset failed");
    else {
      toast.success("Password reset");
      router.push("/auth/login");
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h2 className="mb-4 text-2xl font-bold">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            Reset Password
          </Button>
        </form>
      </Card>
    </main>
  );
}
