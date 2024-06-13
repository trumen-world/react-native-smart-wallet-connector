"use client";
import Page from "@/components/Page";
import { Button } from "@/components/ui/button";
import useUser, { type UserState } from "@/lib/hooks/use-user";
import { cn } from "@/lib/utils";
import { base } from "viem/chains";
import { createConfig, http } from "wagmi";
import { useAccount, useConnect } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppReturn from "@/components/AppReturn";
import { useEffect, useState } from "react";

export default function Create() {
  const [appUrl, setAppUrl] = useState<string>();
  const [user, setUser] = useUser();
  const { connect, status, error } = useConnect();
  const config = createConfig({
    chains: [base],
    connectors: [
      coinbaseWallet({
        appName: "Trumen World",
        preference: "smartWalletOnly",
      }),
    ],
    transports: { [base.id]: http() },
  });
  const account = useAccount({ config });
  const chainId = 8453;
  const connector = coinbaseWallet({
    appName: "Coinbase Smart Wallet w/ React Native",
    preference: "smartWalletOnly",
  });

  async function handleConnect() {
    try {
      connect({
        chainId,
        connector,
      });
      setUser((prevState: UserState) => ({ ...prevState, account }));
    } catch (err) {
      console.error("Connection failed", err);
    }
  }

  useEffect(() => {
    console.log(user.account?.address);
    if (user.account?.address) {
      const APP_URL = `RNCBSmartWallet://?address=${encodeURIComponent(user.account.address)}`;
      setAppUrl(APP_URL);
    }
  }, [user.account?.address]);

  return (
    <Page>
      <p className="p-4 flex flex-col w-96 text-center">
        <span className="text-blue-500 font-bold">{`CREATE & CONNECT`}</span>
      </p>

      {!user.account?.address ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Approve the Coinbase Connection</CardDescription>
          </CardHeader>
          <CardContent className="items-center flex flex-col">
            <Button type="button" onClick={handleConnect}>
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <AppReturn
          appUrl={appUrl}
          title="Successfully Connected!"
          description=""
          message="Return and Sign-In With Ethereum"
        />
      )}

      <p className="p-4 flex flex-col w-96 text-center">
        Connection Status:
        <span
          className={cn(
            status === "success" && "dark:text-lime-500 text-lime-700",
          )}
        >
          {status}
        </span>
      </p>
      {user.account ? (
        <p className="p-4 flex flex-col w-64 items-center text-center sm:text-base md:text-lg lg:text-xl text-indigo-500">
          Account:
          <span className="text-indigo-800 dark:text-indigo-100 text-xs tracking-wide sm:text-sm md:text-base lg:text-lg">
            {user.account.address}
          </span>
        </p>
      ) : (
        <></>
      )}

      {error ? (
        <p className="p-4 flex flex-col text-red-500 w-96 text-center">{`${error}`}</p>
      ) : (
        <></>
      )}
    </Page>
  );
}
