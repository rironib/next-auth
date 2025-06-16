"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button, Divider, Input, Spacer } from "@heroui/react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    const res = await signIn("credentials", {
      ...form,
      redirect: false,
    });

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Logged in!");
      router.push("/");
    }
    setLoading(false);
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleMagic = async () => {
    const res = await signIn("email", {
      email: form.email,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Magic link sent. Check your inbox.");
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />
      <Spacer y={1} />
      <Button
        onClick={handleLogin}
        isLoading={loading}
        fullWidth
        color="primary"
      >
        Sign in with Credentials
      </Button>

      <Divider className="my-4" />
      <Button onClick={handleMagic} fullWidth color="secondary" variant="flat">
        Send Magic Link
      </Button>
      <Button onClick={handleGoogle} fullWidth color="danger" variant="flat">
        Sign in with Google
      </Button>
    </div>
  );
}
