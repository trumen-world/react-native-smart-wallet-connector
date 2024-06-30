"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { Account, Address, Hex, SignableMessage } from "viem";
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
import { args } from "@/lib/constants";
import ReturnButton from "./ReturnButton";
import { config } from "@/lib/chain/wagmi";
import { SignTypedDataData, SignTypedDataVariables } from "wagmi/query";
import { client } from "@/lib/chain/viem";
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

  const { signTypedData } = useSignTypedData({
    config,
    mutation: {
      onSuccess: async (
        signature: SignTypedDataData,
        {
          account,
          message,
          domain,
          types,
        }: {
          account?: `0x${string}` | Account | undefined;
          message: Record<string, unknown>;
          domain?:
            | {
                chainId?: number | undefined;
                name?: string | undefined;
                salt?: `0x${string}` | undefined;
                verifyingContract?: `0x${string}` | undefined;
                version?: string | undefined;
              }
            | undefined;
          types: any;
        },
      ) => {
        console.log("account", account);
        console.log("message", message);
        console.log("data", signature);

        // console.log("client", client);

        setPermitMessage(JSON.stringify(message, null, 2));
        console.log(permitMessage);
        const valid = await client.verifyTypedData({
          address: account as Address,
          domain,
          types,
          primaryType: "PermitSingle",
          message: message,
          signature,
        });
        console.log(valid);
        setUser((prevState: UserState) => ({
          ...prevState,
          permitSignature: {
            hex: signature,
            valid: valid,
          },
        }));
        console.log("user", user);
      },
    },
  });

  const { connect } = useConnect();

  const handleConnect = () => {
    try {
      connect({ ...args });
      setUser((prevState: UserState) => ({ ...prevState, account: address }));
    } catch (err) {
      console.error("Connection failed", err);
    }
  };
  const { data: allowance } = useReadContract({
    abi: PERMIT.contract.abi,
    address: PERMIT.contract.address,
    functionName: "allowance",
    args: [user.address, dummyToken, dummySpender],
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
        nonce: Object.entries(allowance)[2][1] as number, // note only works once per account right now, would need to make dynamic
      },
      spender: dummySpender,
      sigDeadline: toDeadline(PERMIT_SIG_EXPIRATION),
    };
  }, [allowance]);

  const permitData = useMemo(() => {
    if (!permit) return;
    return AllowanceTransfer.getPermitData(permit, PERMIT2_ADDRESS, 84532);
  }, [permit]);

  // const result = useVerifyTypedData({
  //   domain: permitData?.domain as Record<string, unknown>,
  //   types: permitData?.types as any,
  //   message: permitData?.values as any,
  //   primaryType: "PermitSingle",
  //   address: user.address as Address,
  //   signature: user.permitSignature?.hex as Hex,
  // });

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
        types: permitData.types,
        message: permitData.values as any,
        primaryType: "PermitSingle",
      });
    } catch (error) {
      console.error("Error signing typed data:", error);
    }
  };
  const parsedSignature = useMemo(() => {
    if (!user.permitSignature?.hex) return;

    return parseErc6492Signature(user.permitSignature?.hex).signature;
  }, [user.permitSignature?.hex]);

  const { writeContracts } = useWriteContracts();

  const writePermit = useCallback(() => {
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
  }, [parsedSignature, permitData, user.address, writeContracts]);

  // useEffect(() => {
  //   if (result.data !== undefined) {
  //     setUser((prevState: UserState) => ({
  //       ...prevState,
  //       signature: {
  //         hex: prevState.permitSignature!.hex,
  //         valid: result.data,
  //       },
  //     }));
  //   }
  // }, [result.data, setUser]);

  useEffect(() => {
    console.log("Account details:", { address, isConnecting, isConnected });
  }, [address, isConnecting, isConnected]);

  return (
    <Card
      className={cn(
        "m-2 w-5/6 sm:w-2/3 md:w-1/2 lg:max-w-xl",
        user.permitSignature?.valid &&
          "border-lime-500 bg-lime-50 dark:bg-lime-950",
      )}
    >
      <div className="flex flex-col items-center p-4 pt-8">
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
        <CardContent className="flex flex-col items-center">
          {user.permitSignature?.hex ? (
            <div className="flex flex-col gap-3">
              <ReturnButton />
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
        <SignatureBadge signature={user.permitSignature} />
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
    <p className="max-w-sm break-all text-xs">
      {JSON.stringify(message, null, 2) || ""}
    </p>
  </div>
);

const SignatureBadge = ({
  signature,
}: {
  signature: UserState["permitSignature"];
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

export default PermitSigner;
