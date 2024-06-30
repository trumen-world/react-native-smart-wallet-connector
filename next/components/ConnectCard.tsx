"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useConnect } from "wagmi";
import { useAccount } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import useUser, { UserState } from "@/lib/hooks/use-user";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const ConnectCard = () => {
  const [user, setUser] = useUser();
  const { connect, status, error } = useConnect();
  const account = useAccount();
  const chainId = 84532;
  const connector = coinbaseWallet({
    appName: "Coinbase Smart Wallet w/ React Native",
    preference: "smartWalletOnly",
    chainId,
  });
  const handleConnect = async () => {
    try {
      connect({
        chainId,
        connector,
      });
      setUser((prevState: UserState) => ({ ...prevState, account }));
    } catch (err) {
      console.error("Connection failed", err);
    }
  };

  return (
    <Card className="m-2 w-5/6 sm:w-2/3 md:w-1/2 lg:max-w-xl">
      <CardHeader>
        <CardTitle className="text-center">Connect Wallet</CardTitle>
        <CardDescription className="text-center">
          Proceed to load or create a wallet.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Button type="button" onClick={handleConnect}>
          Connect
        </Button>
        {/* <p className="p-4 flex flex-col w-96 text-center">
          Connection Status:
          <span
            className={cn(
              status === "success" && "dark:text-lime-500 text-lime-700",
            )}
          >
            {status}
          </span>
        </p> */}
        {error ? (
          <p className="flex w-96 flex-col p-4 text-center">
            Error:
            <span
              className={"text-red-700 dark:text-red-500"}
            >{`${error}`}</span>
          </p>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectCard;
