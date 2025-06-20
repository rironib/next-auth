import Loading from "@/components/Loading";
import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export const metadata = {
  title: "Email Verification | Next Auth App",
  description: "Verify your email address to activate your account.",
};

export default function VerifyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyClient />
    </Suspense>
  );
}
