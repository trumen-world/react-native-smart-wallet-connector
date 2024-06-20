import Page from "@/components/Page";
import SignerSkeleton from "@/components/SignerSkeleton";
import SiweSigner from "@/components/SiweSigner";
import { Suspense } from "react";

export default async function Siwe() {
  return (
    <Page>
      <Suspense fallback={<SignerSkeleton />}>
        <SiweSigner />
      </Suspense>
    </Page>
  );
}
