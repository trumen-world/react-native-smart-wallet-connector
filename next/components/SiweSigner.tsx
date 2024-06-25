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
import { cn } from "@/lib/utils";
import useUser, { UserState } from "@/lib/hooks/use-user";
import { coinbaseWallet } from "wagmi/connectors";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import { client } from "@/lib/chain/viem";
import ReturnButton from "./ReturnButton";
import { Account, Address, Hex, SignableMessage } from "viem";

const SiweSigner = () => {
  const [user, setUser] = useUser();
  const { address, isConnecting, isConnected } = useAccount();
  const [siweMessage, setSiweMessage] = useState<string | null>(null);
  const [appUrl, setAppUrl] = useState<string | null>(null);
  const { connect } = useConnect();
  const account = useAccount();
  const chainId: 84532 = 84532;
  const connector = coinbaseWallet({
    appName: "Coinbase Smart Wallet w/ React Native",
    preference: "smartWalletOnly",
    chainId: 84532,
  });
  const args = {
    chainId,
    connector,
  };

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: async (
        signature: Hex,
        {
          // account = address!,
          account,
          message,
        }: {
          account?: `0x${string}` | Account | undefined;
          message: SignableMessage;
        },
      ) => {
        console.log("MESSAGE", message);
        console.log(signature);
        console.log(signature.length);
        console.log(account);
        if (!siweMessage) throw new Error("no siwe message");
        const isValid = await client.verifyMessage({
          address: account as `0x${string}`,
          message: siweMessage,
          signature,
        });

        setUser((prevState: UserState) => ({
          ...prevState,
          siweSignature: { hex: signature, valid: isValid },
        }));
        console.log(isValid);
      },
    },
  });

  const handleConnect = () => {
    try {
      connect({ ...args });
      setUser((prevState: UserState) => ({ ...prevState, account }));
    } catch (err) {
      console.error("Connection failed", err);
    }
  };

  const promptToSign = async () => {
    if (!account || !account.address) {
      handleConnect();
      return;
    }

    const message = createSiweMessage({
      scheme: "http",
      domain: window.location.host,
      address: account.address,
      statement: "Smart Wallet SIWE Example",
      uri: window.location.origin,
      version: "1",
      chainId: 84532,
      nonce: generateSiweNonce(),
    });

    setSiweMessage(message);
    try {
      signMessage({
        account: account.address,
        message,
      });
    } catch (error) {
      console.error("Error signing in with Ethereum:", error);
    }
  };

  return (
    <Card
      className={cn(
        "m-2 w-5/6 sm:w-2/3 md:w-1/2 lg:max-w-xl",
        user.siweSignature?.valid &&
          "border-lime-500 bg-lime-50 dark:bg-lime-950",
      )}
    >
      <div className="flex flex-col items-center p-4 pt-8">
        <CardHeader>
          <CardTitle className="text-center">
            {account?.address && account?.status === "connected"
              ? "Sign-In With Ethereum"
              : "Connect Wallet"}
          </CardTitle>
          <CardDescription className="text-center">
            {`Prove it's you with a signature.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {user.siweSignature?.hex ? (
            <div className="flex flex-col gap-3">
              <ReturnButton />
              <Button
                variant={"secondary"}
                type="button"
                onClick={promptToSign}
              >
                Re-Sign
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={promptToSign}>
              {account?.status === "connected" ? "Sign-In" : "Connect"}
            </Button>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex flex-col gap-4">
        <SignatureBadge signature={user.siweSignature} />
        {siweMessage && (
          <MessageBadge title="SIWE Message:" message={siweMessage} />
        )}
      </CardFooter>
    </Card>
  );
};

const MessageBadge = ({
  title,
  message,
}: {
  title: string;
  message: string | undefined;
}) => (
  <div className="flex flex-col items-center">
    <Badge variant={"secondary"}>{title}</Badge>
    <p className="max-w-sm break-all text-xs">{message || ""}</p>
  </div>
);

const SignatureBadge = ({
  signature,
}: {
  signature: UserState["siweSignature"];
}) => (
  <div className="flex flex-col items-center">
    <div className="flex gap-2">
      {signature?.hex && (
        <Badge
          className={
            signature?.valid ? "bg-lime-700 dark:bg-lime-400" : "bg-red-500"
          }
        >
          <div
            className={cn(
              "ml-1 flex gap-[2px]",
              signature.valid
                ? "text-lime-50 dark:text-lime-950"
                : "text-red-800 dark:text-red-500",
            )}
          >
            <p className="text-xs">{signature.valid ? "Valid" : "Invalid"}</p>
            {signature.valid ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </div>
        </Badge>
      )}
    </div>
    {signature?.hex && (
      <p className="mt-2 max-w-sm break-all text-[10px] leading-[12px]">
        Length: {signature?.hex ? signature.hex.length : ""}
        <br />
        {signature?.hex || ""}
      </p>
    )}
  </div>
);

export default SiweSigner;
