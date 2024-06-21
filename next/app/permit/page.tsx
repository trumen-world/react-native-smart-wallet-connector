import Page from "@/components/Page";
import PermitSigner from "@/components/PermitSigner";
import SignerSkeleton from "@/components/SignerSkeleton";
import { Suspense } from "react";

export default async function Batch() {
  return (
    <Page>
      <Suspense fallback={<SignerSkeleton />}>
        <PermitSigner />
      </Suspense>
    </Page>
  );
}
