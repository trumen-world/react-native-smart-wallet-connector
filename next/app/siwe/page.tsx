import Page from "@/components/Page";
import Skeleton from "@/components/Skeleton";
import SiweSigner from "@/components/SiweSigner";
import { Suspense } from "react";

export default async function Siwe() {
  return (
    <Page>
      <Suspense fallback={<Skeleton />}>
        <SiweSigner />
      </Suspense>
    </Page>
  );
}
