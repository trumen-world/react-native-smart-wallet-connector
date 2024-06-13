"use client";

import useUser, { UserState } from "@/lib/hooks/use-user";
import { SiweMessage } from "siwe";
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
import { useEffect, useState } from "react";
import { client, walletClient } from "@/lib/chain/viem";
import { signSiweMessage, verifySiweSignature } from "@/lib/utils";
import { useAccount } from "wagmi";
import { swConfig } from "@/lib/chain/wagmi";
import { Check } from "lucide-react";

const Signer = () => {
  const [user, setUser] = useUser();
  const [message, setMessage] = useState<string | null>(null);
  const chainId = 8453;
  const version = "1";
  const statement = "Smart Wallet React Native SIWE";

  useEffect(() => {
    if (!user.account?.address) return;
    const domain = window.location.host;
    const uri = window.location.origin;
    const address = user.account?.address;
    const nonce = crypto.randomUUID().replace(/-/g, "");
    const message = new SiweMessage({
      domain,
      address,
      chainId,
      uri,
      version,
      statement,
      nonce,
    }).prepareMessage();
    setMessage(message);
  }, [user.account?.address]);

  // useEffect(() => {
  //   if (!account) return;
  //   setUser((prev: UserState) => ({ ...prev, account }));
  // }, [account, setUser]);

  const SIGN_SIWE_MESSAGE = async () => {
    console.log("Account address: ", user.account?.address);
    console.log("Message: ", message);

    if (!user.account?.address || !message) {
      console.error("Missing required parameters for SIGN_SIWE_MESSAGE.");
      return;
    }
    try {
      const signature = await signSiweMessage(message);
      if (signature) {
        setUser((prev: UserState) => ({
          ...prev,
          signature: {
            hex: signature,
            valid: false,
          },
        }));
        const valid = await verifySiweSignature(signature, message);
        if (valid)
          setUser((prev: UserState) => ({
            ...prev,
            signature: {
              hex: signature,
              valid,
            },
          }));
      }
    } catch (error) {
      console.error("Error during SIGN_SIWE_MESSAGE: ", error);
    }
  };

  const RETURN_WITH_SIGNATURE = () => {
    if (user.account && user.signature?.hex) {
      const appUrl = `RNCBSmartWallet://address?address=${encodeURIComponent(user.account.address!)}&signature=${encodeURIComponent(user.signature.hex)}`;
      console.log("appUrl", appUrl);
      window.location.href = appUrl;
    }
    return;
  };

  return (
    <div>
      <Card className="m-2">
        <CardHeader>
          <CardTitle>Sign-In With Ethereum</CardTitle>
          <CardDescription>
            Sign-in using Coinbase Smart Wallet!
          </CardDescription>
        </CardHeader>
        <CardContent className="items-center flex flex-col">
          {user.signature ? (
            <Button type="button" onClick={RETURN_WITH_SIGNATURE}>
              Return to App
            </Button>
          ) : (
            <Button type="button" onClick={SIGN_SIWE_MESSAGE}>
              Sign-In With Ethereum
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="flex flex-col items-center">
            <Badge variant={"secondary"}>Message:</Badge>
            <p className="text-xs max-w-sm break-all">
              {message ? message : typeof message}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-2">
              <Badge variant={"secondary"}>
                Signature{" "}
                {user.signature?.valid && (
                  <div className="flex text-lime-500 gap-[2px] ml-2">
                    <p className="text-xs">Valid</p>
                    <Check className="h-4 w-4 " />
                  </div>
                )}
              </Badge>
            </div>
            <p className="text-xs max-w-sm break-all">
              {user.signature?.hex
                ? user.signature.hex
                : typeof user.signature?.hex}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signer;
