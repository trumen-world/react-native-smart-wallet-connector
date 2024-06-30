import Page from "@/components/Page";
import Skeleton from "@/components/Skeleton";
import TypedSigner from "@/components/TypedSigner";
import { Suspense } from "react";

export default async function Sign() {
  return (
    <Page>
      <Suspense fallback={<Skeleton />}>
        <TypedSigner />
      </Suspense>
    </Page>
  );
}
