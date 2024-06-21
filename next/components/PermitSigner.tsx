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
import { useAccount, useConnect, useDisconnect, useSignTypedData } from "wagmi";
import { Check, X } from "lucide-react";
import { cn, toDeadline } from "@/lib/utils";
import useUser, { UserState } from "@/lib/hooks/use-user";
import { coinbaseWallet } from "wagmi/connectors";
import { client } from "@/lib/chain/viem";
import { NULL_USER, domain, types } from "@/lib/constants";
import { Address } from "viem";
import ms from "ms";
import {
  AllowanceTransfer,
  MaxAllowanceTransferAmount,
  PERMIT2_ADDRESS,
  PermitDetails,
  type PermitSingle,
} from "@uniswap/permit2-sdk";
import { useReadContract } from "wagmi";
import { PERMIT } from "@/lib/chain/contracts/Permit";

interface Permit extends PermitSingle {
  sigDeadline: number;
}

export interface PermitSignature extends Permit {
  signature: string;
}

type Message = {
  details: PermitDetails;
  spender: string;
  sigDeadline: bigint;
};

const PERMIT_EXPIRATION = ms(`30d`);
const PERMIT_SIG_EXPIRATION = ms(`30m`);

const PermitSigner = () => {
  const [user, setUser] = useUser();
  const dummyToken = "0x0000000000000000000000000000000000000B0b";
  const dummySpender = "0x0000000000000000000000000000000000000B0b";
  const {
    address,
    isConnecting,
    isConnected,
    connector: accConnector,
  } = useAccount();
  const [permitMessage, setPermitMessage] = useState<string | null>(null);
  const [appUrl, setAppUrl] = useState<string | null>(null);

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
        console.log("account", account);
        console.log("message", message);
        console.log("signature", signature);
        if (!account || !message) return;
        // setUser((prevState: UserState) => ({
        //   ...prevState,
        //   signature: { hex: signature, valid: null },
        // }));
        // const valid = await client.verifyTypedData({
        //   address: account as Address,
        //   domain,
        //   types,
        //   primaryType: "PermitSingle",
        //   message: message as Message,
        //   signature,
        // });
        // console.log("valid:", valid);
        // setPermitMessage(JSON.stringify(message));
        setUser((prevState: UserState) => ({
          ...prevState,
          signature: { hex: signature, valid: true },
        }));
        console.log(user);
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

  const handleDisconnect = () => {
    try {
      disconnect();
      setPermitMessage(null);
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
    console.log("user.signature?.valid", user.signature?.valid);
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

  const { data: allowance } = useReadContract({
    abi: PERMIT.contract.abi,
    address: PERMIT.contract.address,
    functionName: "allowance",
    args: [address!, dummyToken, dummySpender],
  });

  const permit: Permit | undefined = useMemo(() => {
    if (!allowance) return;
    console.log(allowance);
    return {
      details: {
        token: dummyToken,
        amount: BigInt(MaxAllowanceTransferAmount.toString()),
        expiration: toDeadline(PERMIT_EXPIRATION),
        nonce: Object.keys(allowance)[2], // note only works once per account right now, would need to make dynamic
      },
      spender: dummySpender,
      sigDeadline: toDeadline(PERMIT_SIG_EXPIRATION),
    };
  }, [allowance]);

  const permitData = useMemo(() => {
    if (!permit) return;
    return AllowanceTransfer.getPermitData(permit, PERMIT2_ADDRESS, chainId);
  }, [permit, chainId]);

  const promptToPermit = async () => {
    if (!address) {
      handleConnect();
      return;
    }

    if (!permitData) throw new Error("No content for typed data");
    try {
      signTypedData({
        account: address,
        connector: accConnector,
        domain: permitData.domain as Record<string, unknown>,
        types: permitData?.types,
        message: permitData.values as any,
        primaryType: "PermitSingle",
      });
    } catch (error) {
      console.error("Error signing typed data:", error);
    }
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
            {typeof user.address !== null
              ? "Sign Contract Permission"
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
              <Button type="button" onClick={promptToPermit}>
                Permit
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
            <Button type="button" onClick={promptToPermit}>
              {typeof user.address !== null ? "Permit" : "Connect"}
            </Button>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex flex-col gap-4">
        <SignatureBadge signature={user.signature} />
        {permitMessage && (
          <MessageBadge
            title="Permit Message:"
            message={permitMessage ?? "N/A"}
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
          className={cn(
            "flex gap-[2px] ml-1",
            signature.valid
              ? "text-lime-50 dark:text-lime-950 bg-lime-700 dark:bg-lime-400"
              : "text-red-50 dark:text-red-950 bg-red-500 dark:hover:bg-red-5 00 dark:bg-red-400",
          )}
        >
          <p className="text-xs">
            {signature.valid !== null
              ? signature.valid
                ? "Valid"
                : ""
              : "Invalid"}
          </p>
          {signature.valid ? (
            <Check className="h-4 w-4 " />
          ) : (
            <X className="h-4 w-4 " />
          )}
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

export default PermitSigner;
