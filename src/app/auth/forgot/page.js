"use client";

import { useState } from "react";
import { Alert, Button, Card, Input } from "@heroui/react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }
      toast.success("Check your email for reset link");
      setLoading(false);
      setEmail("");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h2 className="mb-4 text-center text-2xl font-bold">Forgot Password</h2>
        {error && (
          <div className="mx-auto my-3 w-full max-w-xl">
            <Alert variant="faded" color="danger" description={error} />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            isLoading={loading}
            color="primary"
            size="lg"
            type="submit"
            className="w-full"
          >
            Send Reset Link
          </Button>
        </form>
      </Card>
    </main>
  );
}
