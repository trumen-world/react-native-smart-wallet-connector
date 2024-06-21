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
  useSignTypedData,
  useVerifyTypedData,
} from "wagmi";
import { Check, X } from "lucide-react";
import { cn, toDeadline } from "@/lib/utils";
import useUser, { UserState } from "@/lib/hooks/use-user";
import { coinbaseWallet } from "wagmi/connectors";
import { client } from "@/lib/chain/viem";
import { Address, Hex } from "viem";
import ms from "ms";
import {
  AllowanceTransfer,
  MaxAllowanceTransferAmount,
  PERMIT2_ADDRESS,
  type PermitSingle,
} from "@uniswap/permit2-sdk";
import { useReadContract } from "wagmi";
import { PERMIT } from "@/lib/chain/contracts/Permit";
import { parseErc6492Signature } from "viem/experimental";
import { useWriteContracts } from "wagmi/experimental";
interface Permit extends PermitSingle {
  sigDeadline: number;
}

export interface PermitSignature extends Permit {
  signature: string;
}

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

  const { signTypedData } = useSignTypedData({
    mutation: {
      onSuccess: async (signature, { account, message }) => {
        console.log("user.address", user.address);
        console.log("message", message);
        console.log("signature", signature);
        if (!account || !message || !isConnected) return;

        console.log("client", client);

        // setPermitMessage(JSON.stringify(message));
        setUser((prevState: UserState) => ({
          ...prevState,
          signature: {
            hex: signature,
            valid: result.data ? result.data : null,
          },
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

  const { data: allowance } = useReadContract({
    abi: PERMIT.contract.abi,
    address: PERMIT.contract.address,
    functionName: "allowance",
    args: [address!, dummyToken, dummySpender],
  });

  const permit: Permit | undefined = useMemo(() => {
    if (!allowance) return;
    console.log("allowance", allowance);
    console.log(
      "Object.entries(allowance)[2][1]",
      Object.entries(allowance)[2][1],
    );
    return {
      details: {
        token: dummyToken,
        amount: BigInt(MaxAllowanceTransferAmount.toString()),
        expiration: toDeadline(PERMIT_EXPIRATION),
        nonce: Object.entries(allowance)[2][1], // note only works once per account right now, would need to make dynamic
      },
      spender: dummySpender,
      sigDeadline: toDeadline(PERMIT_SIG_EXPIRATION),
    };
  }, [allowance]);

  const permitData = useMemo(() => {
    if (!permit) return;
    return AllowanceTransfer.getPermitData(permit, PERMIT2_ADDRESS, chainId);
  }, [permit, chainId]);

  const result = useVerifyTypedData({
    domain: permitData?.domain as Record<string, unknown>,
    types: permitData?.types as any,
    message: permitData?.values as any,
    primaryType: "PermitSingle",
    address: user.address as Address,
    signature: user.signature?.hex as Hex,
  });

  useEffect(() => {
    console.log("user.signature?.valid", user.signature?.valid);
    const addressParam = address
      ? `?address=${encodeURIComponent(address)}`
      : "";
    const validParam = user.signature?.valid ? `&valid=${result?.data}` : "";
    const signatureParam = user.signature?.hex
      ? `&signature=${encodeURIComponent(user.signature.hex)}`
      : "";
    const url = `RNCBSmartWallet://${addressParam}${signatureParam}${validParam}`;
    console.log("url", url);
    setAppUrl(url);
  }, [address, user.signature?.valid, user.signature?.hex, result?.data]);

  const promptToPermit = async () => {
    if (!address) {
      handleConnect();
      return;
    }

    if (!permitData) throw new Error("No content for typed data");
    try {
      signTypedData({
        account: user.address as Address,
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
  const parsedSignature = useMemo(() => {
    if (!user.signature?.hex) return;

    return parseErc6492Signature(user.signature?.hex).signature;
  }, [user.signature?.hex]);

  const { writeContracts } = useWriteContracts();

  const writePermit = () => {
    writeContracts({
      contracts: [
        {
          address: PERMIT.contract.address,
          abi: PERMIT.contract.abi,
          functionName: "permit",
          args: [user.address, permitData!.values, parsedSignature],
        },
      ],
    });
  };

  useEffect(() => {
    if (result.data !== undefined) {
      setUser((prevState: UserState) => ({
        ...prevState,
        signature: {
          hex: prevState.signature!.hex,
          valid: result.data,
        },
      }));
    }
  }, [result.data, setUser]);

  useEffect(() => {
    console.log("Account details:", { address, isConnecting, isConnected });
    console.log(result.data);
  }, [address, isConnecting, isConnected, result.data]);

  return (
    <Card
      className={cn(
        "m-2",
        result.data && "border-lime-500 bg-lime-50 dark:bg-lime-950",
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
              <Button variant={"link"} type="button" onClick={returnToApp}>
                Return to iOS
              </Button>
              <Button
                variant={"secondary"}
                type="button"
                onClick={promptToPermit}
              >
                Re-Sign
              </Button>
              <Button type="button" onClick={writePermit}>
                Permit
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={promptToPermit}>
              {typeof user.address !== null ? "Sign" : "Connect"}
            </Button>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex flex-col gap-4">
        <SignatureBadge
          signature={user.signature}
          valid={result.data ?? false}
        />
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
  valid,
}: {
  signature: UserState["signature"];
  valid: boolean;
}) => (
  <div className="flex flex-col items-center">
    <div className="flex gap-2">
      {signature?.hex && (
        <Badge
          className={cn(
            "flex gap-[2px] ml-1",
            valid
              ? "text-lime-50 dark:text-lime-950 bg-lime-700 dark:bg-lime-400"
              : "text-red-50 dark:text-red-950 bg-red-500 dark:hover:bg-red-5 00 dark:bg-red-400",
          )}
        >
          <p className="text-xs">{valid ? "Valid" : "Invalid"}</p>
          {valid ? <Check className="h-4 w-4 " /> : <X className="h-4 w-4 " />}
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
