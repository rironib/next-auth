// FILE: src/app/auth/verify/page.js

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) toast.error(data.error);
          else toast.success("Email verified");
          router.push("/auth/login");
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <main className="flex h-full items-center justify-center">
      {loading ? <Spinner /> : <p>Redirecting...</p>}
    </main>
  );
}
