// src/app/auth/login/LoginForm.js

"use client";

import { Button, Input, Link } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { toast } from "@/components/Toast";
import Turnstile from "react-turnstile";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    switch (authError) {
      case "CredentialsSignin":
        toast({
          description: "Invalid email or password.",
          color: "danger",
        });
        break;
      case "OAuthAccountNotLinked":
        toast({
          description:
            "This email is already registered using another method. Please login using email and password.",
          color: "danger",
        });
        break;
      case "OAuthSignin":
        toast({
          description: "Google sign-in failed. Please try again.",
          color: "danger",
        });
        break;
      case "OAuthCallback":
        toast({
          description: "OAuth callback failed. Try again.",
          color: "danger",
        });
        break;
      case "OAuthCreateAccount":
        toast({
          description: "Could not create account. Please try again.",
          color: "danger",
        });
        break;
      case "EmailSignin":
        toast({
          description: "Sign-in link could not be sent. Please try again.",
          color: "danger",
        });
        break;
      case "Verification":
        toast({
          description: "Invalid or expired verification link.",
          color: "danger",
        });
        break;
      case "AccessDenied":
        toast({
          description: "Access denied. Contact support",
          color: "danger",
        });
        break;
      case "Configuration":
        toast({
          description: "Server misconfiguration. Contact admin",
          color: "danger",
        });
        break;
      case "Default":
      default:
        if (authError)
          toast({
            description: "An unexpected error occurred. Please try again.",
            color: "danger",
          });
        break;
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        captchaToken,
      });
      if (!res.ok) {
        switch (res.error) {
          case "CredentialsSignin":
            toast({
              description: "Invalid email or password.",
              color: "danger",
            });
            break;
          case "EmailNotVerified":
            toast({
              description: "Please verify your email before logging in.",
              color: "danger",
            });
            break;
          case "UserNotFound":
            toast({
              description: "No account found with this email",
              color: "danger",
            });
            break;
          case "ServerError":
            toast({
              description: "Internal server error. Please try again later.",
              color: "danger",
            });
            break;
          default:
            toast({
              description:
                res.error || "Something went wrong. Please try again.",
              color: "danger",
            });
            break;
        }
      } else {
        router.push("/dashboard");
      }
    } catch (e) {
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
        <h2 className="mb-2 text-center text-2xl font-bold">Login</h2>
        <div className="mb-4 text-center text-sm">
          Do not have an account? <Link href="/auth/register">Sign up</Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            isRequired
            isClearable
            name="email"
            variant="bordered"
            size="lg"
            label="Username or Email"
            placeholder="Enter your email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            isRequired
            name="password"
            variant="bordered"
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
                  <RiEyeOffLine className="pointer-events-none text-xl text-default-400" />
                ) : (
                  <RiEyeLine className="pointer-events-none text-xl text-default-400" />
                )}
              </button>
            }
          />
          <Link href="/auth/forgot">Forgot password?</Link>
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
            isLoading={loading}
            color="primary"
            size="lg"
            type="submit"
            className="w-full"
          >
            Login
          </Button>
        </form>
        <div className="mb-1 mt-3 text-center">OR</div>
        <div>
          <Button
            variant="bordered"
            size="lg"
            className="mt-4 w-full"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <FcGoogle />
            Sign in with Google
          </Button>
        </div>
      </div>
    </main>
  );
}
