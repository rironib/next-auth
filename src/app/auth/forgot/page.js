// src/app/auth/login/page.js

import { Suspense } from "react";
import Loading from "@/components/Loading";
import ForgotForm from "@/app/auth/forgot/ForgotForm";

export const metadata = {
  title: "Forgot Password | Next Auth App",
  description: "Reset your password securely using your email address.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ForgotForm />
    </Suspense>
  );
}
