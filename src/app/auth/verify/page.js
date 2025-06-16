// app/verify/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const token = useSearchParams().get("token");
  const [status, setStatus] = useState("Verifying...");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setStatus("Invalid token");
      return;
    }

    fetch(`/api/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus(data.error);
        } else {
          setStatus("Email verified! Redirecting to login...");
          setTimeout(() => router.push("/login"), 3000);
        }
      });
  }, [token]);

  return <div className="mt-20 text-center text-lg">{status}</div>;
}
