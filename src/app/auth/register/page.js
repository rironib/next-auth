import { Suspense } from "react";
import Loading from "@/components/Loading";
import SignupForm from "@/app/auth/register/SignupForm";

export const metadata = {
  title: "Register | Next Auth App",
  description: "Create a new account securely with your email and password.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignupForm />
    </Suspense>
  );
}
