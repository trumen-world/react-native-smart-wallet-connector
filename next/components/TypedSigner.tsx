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
import { useAccount, useConnect, useSignTypedData } from "wagmi";
import { cn } from "@/lib/utils";
import useUser, { UserState } from "@/lib/hooks/use-user";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/chain/viem";
import { args, domain, types } from "@/lib/constants";
import { Account, Address, Hex, SignableMessage } from "viem";
import ReturnButton from "./ReturnButton";
import { Check, X } from "lucide-react";

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
  const searchParams = useSearchParams();
  const { connect } = useConnect();
  const { signTypedData } = useSignTypedData({
    mutation: {
      onSuccess: async (
        signature: Hex,
        {
          account,
          message,
        }: {
          account?: `0x${string}` | Account | undefined;
          message: Record<string, unknown>;
        },
      ) => {
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
          typedDataSignature: { hex: signature, valid: valid },
        }));
      },
    },
  });

  const handleConnect = () => {
    try {
      connect({ ...args });
      setUser((prevState: UserState) => ({ ...prevState, account: address }));
    } catch (err) {
      console.error("Connection failed", err);
    }
  };

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
        "m-2 w-5/6 sm:w-2/3 md:w-1/2 lg:max-w-xl",
        user.typedDataSignature?.valid &&
          "border-lime-500 bg-lime-50 dark:bg-lime-950",
      )}
    >
      <div className="flex flex-col items-center p-4 pt-8">
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
        <CardContent className="flex flex-col items-center">
          {user.typedDataSignature?.hex ? (
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
              {typeof user.address !== null ? "Sign" : "Connect"}
            </Button>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex flex-col gap-4">
        {!rnMessage && (
          <p className="text-xs">
            {"Requires a `?message=` parameter with a value"}
          </p>
        )}
        <SignatureBadge signature={user.typedDataSignature} />
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
    <p className="max-w-sm break-all text-xs">{message || ""}</p>
  </div>
);

const SignatureBadge = ({
  signature,
}: {
  signature: UserState["typedDataSignature"];
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
export default TypedSigner;
