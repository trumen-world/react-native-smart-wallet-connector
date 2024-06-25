import Page from "@/components/Page";
import PermitSigner from "@/components/PermitSigner";
import Skeleton from "@/components/Skeleton";
import { Suspense } from "react";

export default async function Batch() {
  return (
    <Page>
      <Suspense fallback={<Skeleton />}>
        <PermitSigner />
      </Suspense>
    </Page>
  );
}
