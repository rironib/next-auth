"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Input, Link } from "@heroui/react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Turnstile from "react-turnstile";
import { toast } from "@/components/Toast";

export default function ResetClient() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password, captchaToken }),
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
          description: "Your password has been reset successfully.",
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
        <h2 className="mb-2 text-center text-3xl font-bold">Reset Password</h2>
        <p className="mb-4 text-center text-sm">
          Remember your password? <Link href="/auth/login">Login</Link>
        </p>
        <div className="mx-auto my-3 w-full max-w-xl">
          <Alert
            variant="faded"
            color="warning"
            description="Password must include at least one lowercase letter, one uppercase letter, one number, and one special character."
          />
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <Input
            isRequired
            name="password"
            variant="bordered"
            size="lg"
            label="Password"
            placeholder="Enter your new password"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button
                aria-label="Toggle password visibility"
                type="button"
                onClick={toggleVisibility}
                className="focus:outline-none"
              >
                {isVisible ? (
                  <RiEyeOffLine className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <RiEyeLine className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
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
            isDisabled={password.length < 6 || !captchaToken}
            isLoading={loading}
            color="primary"
            size="lg"
            type="submit"
            className="w-full"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </main>
  );
}
