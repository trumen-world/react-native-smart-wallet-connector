import Page from "@/components/Page";
import Signer from "@/components/Signer";
import SignerSkeleton from "@/components/SignerSkeleton";
import { Suspense } from "react";

export default async function Sign() {
  return (
    <Page>
      <Suspense fallback={<SignerSkeleton />}>
        <Signer />
      </Suspense>
    </Page>
  );
}
