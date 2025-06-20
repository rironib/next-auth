"use client";

import { Button, Input, Link } from "@heroui/react";
import Turnstile from "react-turnstile";
import { useState } from "react";
import { toast } from "@/components/Toast";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast({
          description:
            data?.error ||
            "An error occurred while resetting your password. Please try again.",
          color: "danger",
        });
      } else {
        router.push("/auth/login");
        toast({
          description: "Check your email for reset link",
          color: "success",
        });
      }
    } catch {
      toast({
        description: "Network error. Please try again.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="mb-2 text-center text-2xl font-bold">Forgot Password</h2>
        <p className="mb-4 text-center text-sm">
          Remember your password? <Link href="/auth/login">Login</Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            isRequired
            isClearable
            name="email"
            variant="bordered"
            size="lg"
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={setCaptchaToken}
            onExpire={() => setCaptchaToken("")}
            size="flexible"
            theme="auto"
            appearance="always"
            className="w-full"
          />
          <Button
            isDisabled={!email || !captchaToken}
            isLoading={loading}
            color="primary"
            size="lg"
            type="submit"
            className="w-full"
            disabled={!captchaToken}
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </main>
  );
}
