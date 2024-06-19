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
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useUser, { UserState } from "@/lib/hooks/use-user";
import { NULL_USER, CHAIN_OPTS as args } from "@/lib/constants";
import { NFT } from "@/lib/chain/contracts/NFT";

const Minter = () => {
  const [user, setUser] = useUser();
  const { address, isConnecting, isConnected } = useAccount();
  const [mintMessage, setMintMessage] = useState<string | null>(null);
  const [appUrl, setAppUrl] = useState<string | null>(null);
  const { disconnect } = useDisconnect({
    mutation: {
      onSettled() {
        setUser(NULL_USER);
      },
    },
  });
  const { connect } = useConnect();
  const account = useAccount();

  const handleDisconnect = () => {
    try {
      disconnect();
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

  const promptToMint = () => {
    if (!account || !account.address) {
      handleConnect();
      return;
    }
    NFT.mint(account.address);
  };

  useEffect(() => {
    console.log("Account details:", { address, isConnecting, isConnected });
  }, [address, isConnecting, isConnected]);

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
              ? "Mint an NFT"
              : "Connect Wallet"}
          </CardTitle>
          <CardDescription className="text-center">
            {`Your Smart Wallet needs an NFT!`}
          </CardDescription>
        </CardHeader>
        <CardContent className="items-center flex flex-col">
          {user.signature?.hex ? (
            <div className="flex flex-col gap-3">
              <Button type="button" onClick={returnToApp}>
                Return
              </Button>
              <Button type="button" onClick={promptToMint}>
                Mint
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
            <Button type="button" onClick={promptToMint}>
              {account?.status === "connected" ? "Mint" : "Connect"}
            </Button>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex flex-col gap-4">
        {/* <SignatureBadge signature={user.signature} /> */}
        {mintMessage && (
          <MessageBadge title="Mint Message:" message={mintMessage} />
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

export default Minter;

// setUser((prevState: UserState) => ({
//   ...prevState,
//   signature: { hex: signature, valid: isValid },
// }));
