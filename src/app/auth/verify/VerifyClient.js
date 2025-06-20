"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { toast } from "@/components/Toast";

export default function VerifyClient() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    if (!token) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setInvalidToken(true);
          toast({
            description: data.error,
            color: "danger",
          });
        } else {
          toast({
            description: "Email verified successfully!",
            color: "success",
          });
          router.push("/auth/login");
        }
      })
      .catch(() => {
        setInvalidToken(true);
        toast({
          description: "Verification failed. Try again later.",
          color: "danger",
        });
      })
      .finally(() => setLoading(false));
  }, [token, router]);

  if (notFound || invalidToken) {
    return (
      <main className="flex h-full items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="mb-4 text-center text-4xl font-bold text-red-600">
            Verification Failed
          </h1>
          <p className="text-center text-lg text-gray-700">
            The verification token is{" "}
            {notFound ? "missing" : "invalid or expired"}. Please check your
            verification link or request a new one.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-full items-center justify-center">
      {loading ? <Spinner size="lg" /> : <p>Redirecting...</p>}
    </main>
  );
}
