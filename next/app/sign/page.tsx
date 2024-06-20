import Page from "@/components/Page";
import SignerSkeleton from "@/components/SignerSkeleton";
import TypedSigner from "@/components/TypedSigner";
import { Suspense } from "react";

export default async function Sign() {
  return (
    <Page>
      <Suspense fallback={<SignerSkeleton />}>
        <TypedSigner />
      </Suspense>
    </Page>
  );
}
