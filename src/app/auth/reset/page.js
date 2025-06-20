import Loading from "@/components/Loading";
import { Suspense } from "react";
import ResetClient from "./ResetClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetClient />
    </Suspense>
  );
}
