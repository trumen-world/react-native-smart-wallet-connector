"use client";

import useUser, { UserState } from "@/lib/hooks/use-user";
import { useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import AppReturn from "./AppReturn";
import { Hex } from "viem";
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

const Signer = ({ accountAddress }: { accountAddress: string }) => {
  const [user, setUser] = useUser();
  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: (signature: Hex) =>
        setUser((prev: UserState) => ({ ...prev, signature })),
    },
  });

  const PROMPT_SIWE = () => {
    const nonce = crypto.randomUUID().replace(/-/g, "");
    const message = new SiweMessage({
      domain: window.location.host,
      address: user.account?.address,
      chainId: 8453,
      uri: window.location.origin,
      version: "1",
      statement: "Smart Wallet React Native SIWE",
      nonce,
    }).prepareMessage();

    if (message) signMessage({ message });
  };

  const RETURN_WITH_SIGNATURE = () => {
    if (user.account && user.signature) {
      const appUrl = `RNCBSmartWallet://address?address=${encodeURIComponent(user.account.address!)}&signature=${encodeURIComponent(user.signature)}`;
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
            <Button type="button" onClick={PROMPT_SIWE}>
              Sign-In With Ethereum
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Badge variant={"secondary"}>Signature:</Badge>
          <p className="text-xs max-w-sm break-all">
            {user.signature ? user.signature : typeof user.signature}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signer;
