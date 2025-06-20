import Loading from "@/components/Loading";
import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyClient />
    </Suspense>
  );
}
