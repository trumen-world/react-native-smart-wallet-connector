"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { Check, X } from "lucide-react";
import { SiweMessage } from "siwe";
import { Hex } from "viem";
import { cn } from "@/lib/utils";
import useUser, { ConnectionStatus, UserState } from "@/lib/hooks/use-user";
import { coinbaseWallet } from "wagmi/connectors";
import { useSearchParams } from "next/navigation";
import { generateSiweNonce } from "viem/siwe";
import { client } from "@/lib/chain/viem";

const Signer = () => {
  const [user, setUser] = useUser();
  const { address, isConnecting, isConnected } = useAccount();
  const [siweMessage, setSiweMessage] = useState<SiweMessage | null>(null);
  const [rnMessage, setRnMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const account = useAccount();

  const chainId = 84532;
  const connector = coinbaseWallet({
    appName: "Coinbase Smart Wallet w/ React Native",
    preference: "smartWalletOnly",
    chainId: 84532,
  });
  const DISCONNECTED_USER = {
    account: null,
    balance: null,
    connectionStatus: ConnectionStatus.DISCONNECTED,
    name: null,
  } as UserState;

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: async (signature, { account, message }) => {
        console.log("MESSAGE", message);
        console.log(signature);
        console.log(signature.length);
        console.log(account);
        if (!siweMessage) throw new Error("no siwe message");
        const isValid = await client.verifyMessage({
          address: account as `0x${string}`,
          message: siweMessage?.prepareMessage(),
          signature,
        });

        setUser((prevState: UserState) => ({
          ...prevState,
          signature: { hex: signature, valid: isValid },
        }));
        console.log(isValid);
      },
    },
  });

  function handleDisconnect() {
    disconnect();
    setUser(DISCONNECTED_USER);
  }
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

  const promptToSign = () => {
    if (!account || !account.address) {
      handleConnect();
      return;
    }

    console.log(account.address);
    const msg = new SiweMessage({
      scheme: "http",
      domain: window.location.host,
      address: account.address,
      statement: "Smart Wallet SIWE Example",
      uri: window.location.origin,
      version: "1",
      chainId: 84532,
      nonce: generateSiweNonce(),
    });
    console.log(msg);

    setSiweMessage(msg);

    signMessage({
      account: account.address,
      message: msg.prepareMessage(),
    });
  };

  const returnToApp = () => {
    if (account.address && user.signature?.hex) {
      const appUrl = `RNCBSmartWallet://address?address=${encodeURIComponent(account.address)}&signature=${encodeURIComponent(user.signature.hex)}`;
      console.log("appUrl", appUrl);
      window.location.href = appUrl;
    }
  };

  useEffect(() => {
    console.log("Account details:", { address, isConnecting, isConnected });
  }, [address, isConnecting, isConnected]);

  useEffect(() => {
    setRnMessage(searchParams.get("message"));
  }, [searchParams]);

  return (
    <div>
      <Card className="m-2">
        <div className="flex flex-col sm:flex-row items-center p-4 pt-8">
          <CardHeader>
            <CardTitle>Sign-In With Ethereum</CardTitle>
            <CardDescription>
              Sign-in using Coinbase Smart Wallet!
            </CardDescription>
          </CardHeader>
          <CardContent className="items-center flex flex-col">
            {user.signature ? (
              <div className="flex flex-col gap-3">
                <Button type="button" onClick={returnToApp}>
                  Return to App
                </Button>
                <Button type="button" onClick={promptToSign}>
                  SIWE
                </Button>
                <Button
                  type="button"
                  className="bg-amber-800 dark:bg-amber-500"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={promptToSign}>
                Sign-In With Ethereum
              </Button>
            )}
          </CardContent>
        </div>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex flex-col items-center">
            <Badge variant={"secondary"}>React Native Message:</Badge>
            <p className="text-xs max-w-sm break-all">
              {rnMessage ? rnMessage : ""}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Badge variant={"secondary"}>SIWE Message:</Badge>
            <p className="text-xs max-w-sm break-all">
              {siweMessage?.prepareMessage()
                ? siweMessage.prepareMessage()
                : ""}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-2">
              <Badge variant={"secondary"}>
                Signature{" "}
                {user.signature?.hex && (
                  <div
                    className={cn(
                      "flex  gap-[2px] ml-2",
                      user.signature?.valid === true
                        ? "text-lime-800 dark:text-lime-500"
                        : "text-red-800 dark:text-red-500",
                    )}
                  >
                    <p className="text-xs">
                      {user.signature?.valid === true ? "Valid" : "Invalid"}
                    </p>
                    {user.signature?.valid === true ? (
                      <Check className="h-4 w-4 " />
                    ) : (
                      <X className="h-4 w-4 " />
                    )}
                  </div>
                )}
              </Badge>
            </div>
            <p className="text-xs max-w-sm break-all mt-2">
              Length: {user.signature?.hex ? user.signature.hex.length : ""}
              <br />
              {user.signature?.hex ? user.signature.hex : ""}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signer;
