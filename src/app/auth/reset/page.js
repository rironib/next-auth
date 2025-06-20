import Loading from "@/components/Loading";
import { Suspense } from "react";
import ResetClient from "./ResetClient";

export const metadata = {
  title: "Reset Password | Next Auth App",
  description: "Set a new password for your account securely.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetClient />
    </Suspense>
  );
}
