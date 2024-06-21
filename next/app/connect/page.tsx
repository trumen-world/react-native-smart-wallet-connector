"use client";
import Page from "@/components/Page";
import useUser, { type UserState } from "@/lib/hooks/use-user";
import { useEffect, useState } from "react";
import ConnectCard from "@/components/ConnectCard";
import { useAccount, useDisconnect } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NULL_USER } from "@/lib/constants";
import ReturnButton from "@/components/ReturnButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Diamond,
  Fingerprint,
  LockKeyholeOpen,
  PackagePlus,
  ScanFace,
} from "lucide-react";
export default function Create() {
  const [appUrl, setAppUrl] = useState<string>();
  const [user, setUser] = useUser();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect({
    mutation: {
      onSettled() {
        setUser(NULL_USER);
      },
    },
  });

  const routeToSIWE = () => {
    router.replace(`/siwe`);
  };

  useEffect(() => {
    console.log(user.address);
    if (user.address) {
      const APP_URL = `RNCBSmartWallet://?address=${encodeURIComponent(user.address)}`;
      setAppUrl(APP_URL);
    }
  }, [user.address]);

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
            "m-2",
            isConnected === true &&
              "border-lime-500 bg-lime-50 dark:bg-lime-950",
          )}
        >
          <div className="flex flex-col sm:flex-row items-center p-4 pt-8">
            <CardHeader>
              <CardTitle className="text-center">
                {user.address && isConnected === true
                  ? "Smart Wallet is Connected!"
                  : "Connect Wallet"}
              </CardTitle>
              <CardDescription className="text-center">
                {`Let's verify your wallet's signature by signing in with Ethereum (SIWE).`}
              </CardDescription>
            </CardHeader>
            <CardContent className="items-center flex flex-col">
              <div className="flex flex-col gap-3">
                <ReturnButton user={user} />
                <div className="flex gap-2 items-center w-full">
                  <Link
                    href="/connect"
                    className="text-lg w-full flex font-semibold md:text-base"
                  >
                    <Button
                      variant={"outline"}
                      className="rounded-lg text-base text-center flex gap-1 hover:border-2  hover:border-primary hover:shadow-md  border-2 border-transparent"
                    >
                      <ScanFace className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="/siwe"
                    className="text-lg w-full flex font-semibold md:text-base"
                  >
                    <Button
                      variant={"outline"}
                      className="rounded-lg text-base text-center flex gap-1 hover:border-2 hover:border-primary hover:shadow-md  border-2 border-transparent"
                    >
                      <Diamond className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="/sign"
                    className="text-lg w-full flex font-semibold md:text-base"
                  >
                    <Button
                      variant={"outline"}
                      className="rounded-lg text-base text-center flex gap-1 hover:border-2 hover:border-primary hover:shadow-md  border-2 border-transparent"
                    >
                      <Fingerprint className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="/batch"
                    className="text-lg w-full flex font-semibold md:text-base"
                  >
                    <Button
                      variant={"outline"}
                      className="rounded-lg text-base text-center flex gap-1 hover:border-2 hover:border-primary hover:shadow-md  border-2 border-transparent"
                    >
                      <PackagePlus className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link
                    href="/permit"
                    className="text-lg w-full flex font-semibold md:text-base"
                  >
                    <Button
                      variant={"outline"}
                      className="rounded-lg text-base text-center flex gap-1 hover:border-2 hover:border-primary hover:shadow-md  border-2 border-transparent"
                    >
                      <LockKeyholeOpen className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </div>
          <CardFooter className="flex flex-col gap-4"></CardFooter>
        </Card>
      ) : (
        <ConnectCard />
      )}
    </Page>
  );
}
