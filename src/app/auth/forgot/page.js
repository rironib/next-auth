"use client";

import { useState, useRef } from "react";
import { Alert, Button, Card, Input } from "@heroui/react";
import toast from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY; // Define this in your .env

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const captchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const token = await captchaRef.current?.executeAsync();
    captchaRef.current?.reset();

    try {
      const res = await fetch("/api/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
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
    } catch {
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
            isRequired
            isClearable
            name="email"
            size="lg"
            label="Email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ReCAPTCHA sitekey={SITE_KEY} size="invisible" ref={captchaRef} />
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
