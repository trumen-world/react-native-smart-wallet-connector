"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  useSignTypedData,
} from "wagmi";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useUser, { UserState } from "@/lib/hooks/use-user";
import { coinbaseWallet } from "wagmi/connectors";
import { useSearchParams } from "next/navigation";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import { client, walletClient } from "@/lib/chain/viem";
import { NULL_USER, domain, types } from "@/lib/constants";
import { parseErc6492Signature } from "viem/experimental";
import { Address } from "viem";

const TypedSigner = () => {
  const [user, setUser] = useUser();
  const { address, isConnecting, isConnected } = useAccount();
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
  const { signTypedData } = useSignTypedData({
    mutation: {
      onSuccess: async (signature, { account, message }) => {
        console.log(signature);
        console.log(account);
        console.log(message);
        const isValid = await client.verifyMessage({
          address: account as Address,
          message: Object.keys(message)[0],
          signature,
        });
        console.log(isValid);
        setUser((prevState: UserState) => ({
          ...prevState,
          signature: { hex: signature, valid: isValid },
        }));
      },
    },
  });
  const { connect } = useConnect();
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

  const parsedSignature = useMemo(() => {
    if (!user.signature?.hex) return;

    return parseErc6492Signature(user.signature.hex).signature;
  }, [user.signature?.hex]);

  const handleDisconnect = () => {
    try {
      disconnect();
      setRnMessage(null);
      setUser(NULL_USER);
    } catch (err) {
      console.error("Disonnection failed", err);
    }
  };
  const handleConnect = () => {
    try {
      connect({ ...args });
      setUser((prevState: UserState) => ({ ...prevState, account: address }));
    } catch (err) {
      console.error("Connection failed", err);
    }
  };
  const returnToApp = () => {
    if (!appUrl) {
      throw new Error("Cannot return to app without appUrl");
    }
    if (address && user.signature?.hex) {
      window.location.href = appUrl;
    }
  };

  useEffect(() => {
    const addressParam = address
      ? `?address=${encodeURIComponent(address)}`
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
  }, [address, user.signature?.valid, user.signature?.hex]);

  const promptToSign = async () => {
    if (!address) {
      handleConnect();
      return;
    }

    try {
      signTypedData({
        account: address,
        domain,
        types,
        message: {
          from: {
            name: "Matt",
            wallet: "0x0000000000000000000000000000000000000000",
          },
          to: {
            name: "Bianca",
            wallet: "0x0000000000000000000000000000000000000001",
          },
          contents: searchParams.get("message") || "Default Message",
        },
        primaryType: "Mail",
      });
    } catch (error) {
      console.error("Error signing typed data:", error);
    }
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
            {address && isConnected === true
              ? "Sign Typed Data"
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
                Sign
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
              {isConnected === true ? "Sign" : "Connect"}
            </Button>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex flex-col gap-4">
        <SignatureBadge signature={user.signature} />
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

export default TypedSigner;
