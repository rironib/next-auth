// FILE: src/app/auth/reset/page.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Card, Input } from "@heroui/react";
import toast from "react-hot-toast";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Reset failed");
    } else {
      toast.success("Password reset");
      router.push("/auth/login");
    }
    setLoading(false);
  };

  return (
    <main className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h2 className="mb-6 text-center text-3xl font-bold">Reset Password</h2>

        {error && (
          <div className="mx-auto my-3 w-full max-w-xl">
            <Alert variant="faded" color="danger" description={error} />
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <Input
            isRequired
            name="password"
            size="lg"
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <RiEyeOffLine className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <RiEyeLine className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
          />
          <Button
            isLoading={loading}
            color="primary"
            size="lg"
            type="submit"
            className="w-full"
          >
            Reset Password
          </Button>
        </form>
      </Card>
    </main>
  );
}
