"use client";

import { Alert, Button, Spinner } from "@heroui/react";
import { signIn, useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (error) {
      switch (error) {
        case "OAuthAccountNotLinked":
          setErrorMsg("This account is already linked with another provider.");
          break;
        case "AccessDenied":
          setErrorMsg("Access denied. Please use an allowed account.");
          break;
        default:
          setErrorMsg("Login failed. Try again.");
      }
    }
  }, [error]);

  if (status === "loading") return <Spinner />;

  const handleGoogleLogin = () => {
    signIn("google", {
      callbackUrl,
      prompt: "select_account",
    });
  };

  if (session) return redirect("/dashboard");

  return (
    <main className="flex flex-col items-center justify-center px-4 text-center">
      {errorMsg && (
        <div className="mb-6 w-full max-w-md">
          <Alert color="danger" description={errorMsg} />
        </div>
      )}

      <div className="flex justify-center gap-6">
        <Button size="lg" color="primary" onPress={handleGoogleLogin}>
          Sign in with Google
        </Button>
      </div>
    </main>
  );
}
