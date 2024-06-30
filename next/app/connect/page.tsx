"use client";
import Page from "@/components/Page";
import useUser, { type UserState } from "@/lib/hooks/use-user";
import { useEffect } from "react";
import ConnectCard from "@/components/ConnectCard";
import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ReturnButton from "@/components/ReturnButton";
import Link from "next/link";
import {
  Diamond,
  Fingerprint,
  LockKeyholeOpen,
  PackagePlus,
  ScanFace,
} from "lucide-react";

export default function Connect() {
  const [user, setUser] = useUser();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected === false) {
      setUser((prevState: UserState) => ({ ...prevState, account: null }));
    }
  }, [isConnected, setUser]);

  return (
    <Page>
      {user.address && isConnected === true ? (
        <Card
          className={cn(
            "m-2 w-5/6 sm:w-2/3 md:w-1/2 lg:max-w-xl",
            isConnected === true &&
              "border-lime-500 bg-lime-50 dark:bg-lime-950",
          )}
        >
          <div className="flex flex-col items-center p-4 pt-8">
            <CardHeader>
              <CardTitle className="text-center">
                {user.address && isConnected === true
                  ? "Smart Wallet is Connected!"
                  : "Connect Wallet"}
              </CardTitle>
              <CardDescription className="text-center">
                Batch mint NFTs, SIWE, or sign typed data.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="flex flex-col gap-3">
                <div className="flex w-full items-center gap-2">
                  <Link
                    href="/siwe"
                    className="flex w-full text-lg font-semibold md:text-base"
                  >
                    <Button
                      variant={"outline"}
                      className="flex gap-1 rounded-lg border-2 border-transparent text-center text-base hover:border-2 hover:border-primary hover:shadow-md"
                    >
                      <Diamond className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="/sign"
                    className="flex w-full text-lg font-semibold md:text-base"
                  >
                    <Button
                      variant={"outline"}
                      className="flex gap-1 rounded-lg border-2 border-transparent text-center text-base hover:border-2 hover:border-primary hover:shadow-md"
                    >
                      <Fingerprint className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="/batch"
                    className="flex w-full text-lg font-semibold md:text-base"
                  >
                    <Button
                      variant={"outline"}
                      className="flex gap-1 rounded-lg border-2 border-transparent text-center text-base hover:border-2 hover:border-primary hover:shadow-md"
                    >
                      <PackagePlus className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="#"
                    className="flex w-full cursor-not-allowed text-lg font-semibold md:text-base"
                  >
                    <Button
                      variant={"outline"}
                      className="flex cursor-not-allowed gap-1 rounded-lg border-2 border-transparent text-center text-base opacity-25 hover:border-2 hover:border-primary hover:shadow-md"
                    >
                      <LockKeyholeOpen className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <ReturnButton />
              </div>
            </CardContent>
          </div>
        </Card>
      ) : (
        <ConnectCard />
      )}
    </Page>
  );
}
