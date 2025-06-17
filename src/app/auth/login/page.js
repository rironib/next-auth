// FILE: src/app/auth/login/page.js
"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Input, Link } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    switch (authError) {
      case "CredentialsSignin":
        setError("Invalid email or password.");
        break;
      case "OAuthAccountNotLinked":
        setError(
          "This email is already registered using another method. Please login using email and password.",
        );
        break;
      case "OAuthSignin":
        setError("Google sign-in failed. Please try again.");
        break;
      case "OAuthCallback":
        setError("OAuth callback failed. Try again.");
        break;
      case "OAuthCreateAccount":
        setError("Could not create account. Please try again.");
        break;
      case "EmailSignin":
        setError("Sign-in link could not be sent. Please try again.");
        break;
      case "Verification":
        setError("Invalid or expired verification link.");
        break;
      case "AccessDenied":
        setError("Access denied. Contact support.");
        break;
      case "Configuration":
        setError("Server misconfiguration. Contact admin.");
        break;
      case "Default":
      default:
        if (authError)
          setError("An unexpected error occurred. Please try again.");
        break;
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Login successful!");
      router.push("/dashboard");
    } else {
      console.log(res.error);
      switch (res.error) {
        case "CredentialsSignin":
          setError("Invalid email or password");
          break;
        case "EmailNotVerified":
          setError("Please verify your email before logging in");
          break;
        case "UserNotFound":
          setError("No account found with this email");
          break;
        case "ServerError":
          setError("Internal server error. Please try again later.");
          break;
        default:
          setError(res.error || "Something went wrong");
          break;
      }
    }
  };

  return (
    <main className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h2 className="mb-4 text-center text-3xl font-bold">Login</h2>
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
            label="Username or Email"
            placeholder="Enter your email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
            Login
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/auth/forgot">Forgot password?</Link>
          <Link href="/auth/register">Register</Link>
        </div>
        <Button
          color="primary"
          size="lg"
          className="mt-4 w-full"
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Sign in with Google
        </Button>
      </Card>
    </main>
  );
}
