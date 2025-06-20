// src/app/auth/login/page.js

import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Loading from "@/components/Loading";

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}
