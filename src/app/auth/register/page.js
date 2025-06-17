"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Link,
  Select,
  SelectItem,
} from "@heroui/react";

export default function RegisterPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      toast.success("Check your email for verification");
      router.push("/auth/login");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h2 className="mb-6 text-center text-3xl font-bold">Register</h2>

        {error && (
          <div className="mx-auto my-3 w-full max-w-xl">
            <Alert variant="faded" color="danger" description={error} />
          </div>
        )}

        <Form onSubmit={handleSubmit} className="space-y-4">
          <Input
            isClearable
            name="name"
            size="lg"
            label="Full Name"
            placeholder="Enter your full name"
            type="text"
            required
          />
          <Input
            isClearable
            name="username"
            size="lg"
            label="Username"
            placeholder="Enter your username"
            type="text"
            required
          />
          <Input
            isClearable
            name="email"
            size="lg"
            label="Email"
            placeholder="Enter your email"
            type="email"
            required
          />
          <Input
            name="password"
            size="lg"
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
          <Select
            size="lg"
            name="gender"
            label="Gender"
            placeholder="Select an option"
            required
          >
            <SelectItem key="male">Male</SelectItem>
            <SelectItem key="female">Female</SelectItem>
            <SelectItem key="other">Others</SelectItem>
          </Select>

          <Button
            isLoading={loading}
            color="primary"
            size="lg"
            type="submit"
            className="w-full"
          >
            Register
          </Button>
        </Form>

        <p className="mt-4 text-center text-sm">
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </Card>
    </main>
  );
}
