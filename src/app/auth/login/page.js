// src/app/auth/login/page.js

import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Login | Next Auth App",
  description:
    "Sign in to your account securely using your email and password or social login.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}
