"use client";

import { Button, Form, Input, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Turnstile from "react-turnstile";
import { toast } from "@/components/Toast";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));
    formData.captchaToken = captchaToken;
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          description:
            data?.error ||
            "An error occurred while registration. Please try again.",
          color: "danger",
        });
      } else {
        router.push("/auth/login");
        toast({
          description:
            "Registration successful. Check your email for verification",
          color: "success",
        });
      }
    } catch (err) {
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
        <h2 className="mb-2 text-center text-3xl font-bold">Register</h2>
        <p className="mb-4 text-center text-sm">
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Input
            isClearable
            name="name"
            size="lg"
            variant="bordered"
            label="Full Name"
            placeholder="Enter your full name"
            type="text"
            required
          />
          <Input
            isClearable
            name="username"
            size="lg"
            variant="bordered"
            label="Username"
            placeholder="Enter your username"
            type="text"
            required
          />
          <Input
            isClearable
            name="email"
            size="lg"
            variant="bordered"
            label="Email"
            placeholder="Enter your email"
            type="email"
            required
          />
          <Input
            name="password"
            size="lg"
            variant="bordered"
            label="Password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
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
            required
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
            color="primary"
            size="lg"
            type="submit"
            className="w-full"
            isLoading={loading}
            disabled={!captchaToken}
          >
            Create account
          </Button>
        </Form>
      </div>
    </main>
  );
}
