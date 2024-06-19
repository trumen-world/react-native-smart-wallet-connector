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
import { useSearchParams } from "next/navigation";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import { client } from "@/lib/chain/viem";
import { NULL_USER } from "@/lib/constants";

const Signer = () => {
  const [user, setUser] = useUser();
  const { address, isConnecting, isConnected } = useAccount();
  const [siweMessage, setSiweMessage] = useState<string | null>(null);
  const [rnMessage, setRnMessage] = useState<string | null>(null);
  const [appUrl, setAppUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { disconnect } = useDisconnect({
    mutation: {
      onSettled() {
        setUser(NULL_USER);
      },
    },
  });
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
      onSuccess: async (signature, { account, message }) => {
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
          signature: { hex: signature, valid: isValid },
        }));
        console.log(isValid);
      },
    },
  });

  const handleDisconnect = () => {
    try {
      disconnect();
      setSiweMessage(null);
      setUser(NULL_USER);
    } catch (err) {
      console.error("Disonnection failed", err);
    }
  };
  const handleConnect = () => {
    try {
      connect({ ...args });
      setUser((prevState: UserState) => ({ ...prevState, account }));
    } catch (err) {
      console.error("Connection failed", err);
    }
  };
  const returnToApp = () => {
    if (!appUrl) {
      throw new Error("Cannot return to app without appUrl");
    }
    if (account.address && user.signature?.hex) {
      window.location.href = appUrl;
    }
  };

  useEffect(() => {
    const addressParam = account.address
      ? `?address=${encodeURIComponent(account.address)}`
      : "";
    const validParam = user.signature?.valid
      ? `&valid=${user.signature?.valid}`
      : "";
    const signatureParam = user.signature?.hex
      ? `&signature=${encodeURIComponent(user.signature.hex)}`
      : "";
    const url = `RNCBSmartWallet://${addressParam}${signatureParam}${validParam}`;
    console.log("url", url);
    setAppUrl(url);
  }, [account.address, user.signature?.valid, user.signature?.hex]);

  const promptToSign = () => {
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

    console.log(message);
    setSiweMessage(message);

    signMessage({
      account: account.address,
      message,
    });
  };

  useEffect(() => {
    console.log("Account details:", { address, isConnecting, isConnected });
  }, [address, isConnecting, isConnected]);

  useEffect(() => {
    setRnMessage(searchParams.get("message"));
  }, [searchParams]);

  return (
    <Card
      className={cn(
        "m-2",
        user.signature?.valid && "border-lime-500 bg-lime-50 dark:bg-lime-950",
      )}
    >
      <div className="flex flex-col sm:flex-row items-center p-4 pt-8">
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
        <CardContent className="items-center flex flex-col">
          {user.signature?.hex ? (
            <div className="flex flex-col gap-3">
              <Button type="button" onClick={returnToApp}>
                Return
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
              {account?.status === "connected" ? "Sign-In" : "Connect"}
            </Button>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex flex-col gap-4">
        <SignatureBadge signature={user.signature} />
        {siweMessage && (
          <MessageBadge title="SIWE Message:" message={siweMessage} />
        )}
        {rnMessage && (
          <MessageBadge
            title="React Native Message:"
            message={rnMessage ?? ""}
          />
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
    <p className="text-xs max-w-sm break-all">{message || ""}</p>
  </div>
);

const SignatureBadge = ({
  signature,
}: {
  signature: UserState["signature"];
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
              "flex gap-[2px] ml-1",
              signature.valid
                ? "text-lime-50 dark:text-lime-950"
                : "text-red-800 dark:text-red-500",
            )}
          >
            <p className="text-xs">{signature.valid ? "Valid" : "Invalid"}</p>
            {signature.valid ? (
              <Check className="h-4 w-4 " />
            ) : (
              <X className="h-4 w-4 " />
            )}
          </div>
        </Badge>
      )}
    </div>
    {signature?.hex && (
      <p className="text-[10px] max-w-sm break-all mt-2 leading-[12px]">
        Length: {signature?.hex ? signature.hex.length : ""}
        <br />
        {signature?.hex || ""}
      </p>
    )}
  </div>
);

export default Signer;
