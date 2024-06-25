import Page from "@/components/Page";
import Link from "next/link";
import {
  Diamond,
  Fingerprint,
  LockKeyholeOpen,
  PackagePlus,
  ScanFace,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <Page>
      <h1 className="mb-8 flex flex-col p-4 text-center">
        <span className="text-2xl font-bold text-blue-500">
          Coinbase Smart Wallet
        </span>
        React Native Integration
      </h1>
      <div className="flex w-full max-w-xl items-center justify-center gap-2">
        <Link
          href="/connect"
          className="flex justify-center text-lg font-semibold md:text-base"
        >
          <Button
            variant={"secondary"}
            className="flex gap-1 rounded-lg border-2 border-transparent text-center text-base hover:border-2 hover:border-primary hover:shadow-md"
          >
            <ScanFace className="h-4 w-4" />
          </Button>
        </Link>
        <Link
          href="/siwe"
          className="flex justify-center text-lg font-semibold md:text-base"
        >
          <Button
            variant={"secondary"}
            className="flex gap-1 rounded-lg border-2 border-transparent text-center text-base hover:border-2 hover:border-primary hover:shadow-md"
          >
            <Diamond className="h-4 w-4" />
          </Button>
        </Link>
        <Link
          href="/sign"
          className="flex justify-center text-lg font-semibold md:text-base"
        >
          <Button
            variant={"secondary"}
            className="flex gap-1 rounded-lg border-2 border-transparent text-center text-base hover:border-2 hover:border-primary hover:shadow-md"
          >
            <Fingerprint className="h-4 w-4" />
          </Button>
        </Link>
        <Link
          href="/batch"
          className="flex justify-center text-lg font-semibold md:text-base"
        >
          <Button
            variant={"secondary"}
            className="flex gap-1 rounded-lg border-2 border-transparent text-center text-base hover:border-2 hover:border-primary hover:shadow-md"
          >
            <PackagePlus className="h-4 w-4" />
          </Button>
        </Link>
        <Link
          href="#"
          className="flex justify-center text-lg font-semibold opacity-25 md:text-base"
        >
          <Button
            variant={"secondary"}
            className="flex cursor-not-allowed gap-1 rounded-lg border-2 border-transparent text-center text-base hover:border-2 hover:border-primary hover:shadow-md"
          >
            <LockKeyholeOpen className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Page>
  );
}
