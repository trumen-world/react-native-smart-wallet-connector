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
import { useAccount, useConnect, useDisconnect, useSignTypedData } from "wagmi";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useUser, { UserState } from "@/lib/hooks/use-user";
import { coinbaseWallet } from "wagmi/connectors";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/chain/viem";
import { NULL_USER, domain, types } from "@/lib/constants";
import { Address } from "viem";
import SignatureBadge from "./SignatureBadge";

type Message = {
  from: {
    name: string;
    wallet: Address;
  };
  to: {
    name: string;
    wallet: Address;
  };
  contents: string;
};

const TypedSigner = () => {
  const [user, setUser] = useUser();
  const {
    address,
    isConnecting,
    isConnected,
    connector: accConnector,
  } = useAccount();
  const [rnMessage, setRnMessage] = useState<string | null>(null);
  const [appUrl, setAppUrl] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const { signTypedData } = useSignTypedData({
    mutation: {
      onSuccess: async (signature, { account, message }) => {
        console.log("account", account);
        console.log("message", message);
        console.log("signature", signature);
        if (!account || !message)
          throw new Error("Missing verification params");
        const valid = await client.verifyTypedData({
          address: account as Address,
          domain,
          types,
          primaryType: "Mail",
          message: message as Message,
          signature,
        });
        console.log("valid:", valid);
        setUser((prevState: UserState) => ({
          ...prevState,
          signature: { hex: signature, valid: valid },
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
    const contents = searchParams.get("message");

    if (!contents) throw new Error("No content for typed data");
    try {
      signTypedData({
        account: address,
        connector: accConnector,
        domain,
        types,
        message: {
          from: {
            name: "Bob",
            wallet: "0x0000000000000000000000000000000000000000" as Address,
          },
          to: {
            name: "Alice",
            wallet: "0x0000000000000000000000000000000000000001" as Address,
          },
          contents,
        } as Message,
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
            {typeof user.address !== null
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
              <Button variant={"link"} type="button" onClick={returnToApp}>
                Return to iOS
              </Button>
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
              {typeof user.address !== null ? "Sign" : "Connect"}
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

export default TypedSigner;
