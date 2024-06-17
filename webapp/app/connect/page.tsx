"use client";
import Page from "@/components/Page";
import useUser, { type UserState } from "@/lib/hooks/use-user";
import AppReturn from "@/components/AppReturn";
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
export default function Create() {
  const [appUrl, setAppUrl] = useState<string>();
  const [user, setUser] = useUser();
  const router = useRouter();
  const { disconnect } = useDisconnect({
    mutation: {
      onSettled() {
        setUser(NULL_USER);
      },
    },
  });

  const handleDisconnect = () => {
    try {
      disconnect();
      setAppUrl("");
      setUser(NULL_USER);
    } catch (err) {
      console.error("Disonnection failed", err);
    }
  };

  const routeToSIWE = () => {
    router.replace(`${process.env.NEXT_PUBLIC_DOMAIN}/sign`);
  };

  useEffect(() => {
    console.log(user.account?.address);
    if (user.account?.address) {
      const APP_URL = `RNCBSmartWallet://?address=${encodeURIComponent(user.account.address)}`;
      setAppUrl(APP_URL);
    }
  }, [user.account?.address]);

  useEffect(() => {
    if (user.account?.status === "disconnected") {
      setUser((prevState: UserState) => ({ ...prevState, account: null }));
    }
  }, [user.account?.status, setUser]);

  return (
    <Page>
      {user.account?.address && user.account.status === "connected" ? (
        <Card
          className={cn(
            "m-2",
            user.account.status === "connected" && "border-lime-500 bg-lime-50",
          )}
        >
          <div className="flex flex-col sm:flex-row items-center p-4 pt-8">
            <CardHeader>
              <CardTitle className="text-center">
                {user.account?.address && user.account?.status === "connected"
                  ? "Smart Wallet is Connected!"
                  : "Connect Wallet"}
              </CardTitle>
              <CardDescription className="text-center">
                {`Let's verify your wallet's signature by signing in with Ethereum (SIWE).`}
              </CardDescription>
            </CardHeader>
            <CardContent className="items-center flex flex-col">
              <div className="flex flex-col gap-3">
                <Button type="button" onClick={routeToSIWE}>
                  SIWE
                </Button>
                <ReturnButton user={user} />
                <Button
                  type="button"
                  className="bg-amber-800 dark:bg-amber-500"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
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
