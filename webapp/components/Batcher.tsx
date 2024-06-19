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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { cn } from "@/lib/utils";
import useUser, { UserState } from "@/lib/hooks/use-user";
import { NULL_USER, CHAIN_OPTS as args } from "@/lib/constants";
import { useWriteContracts, useCallsStatus } from "wagmi/experimental";
import useBatch, { BatchState } from "@/lib/hooks/use-batch";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { PackagePlus, Plus, PlusCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseAbiItem } from "viem";

const FormSchema = z.object({
  address: z.string(),
  abi: z.any(),
  functionName: z.string(),
  args: z.string().array(),
});

const Batcher = () => {
  const [user, setUser] = useUser();
  const [batch, setBatch] = useBatch();
  const [appUrl, setAppUrl] = useState<string | null>(null);

  const { connect, error } = useConnect();
  const { data: id, writeContracts } = useWriteContracts();
  const account = useAccount();
  const { data: callsStatus } = useCallsStatus({
    id: id as string,
    query: {
      enabled: !!id,
      // Poll every second until the calls are confirmed
      refetchInterval: (data) =>
        data.state.data?.status === "CONFIRMED" ? false : 1000,
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: "0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
      abi: [
        parseAbiItem("function safeMint(address recipient) view returns ()"),
      ],
      functionName: "safeMint",
      args: [""],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "args" as never,
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form Data Submitted:", data);
    const transaction = {
      address: data.address as `0x${string}`,
      abi: data.abi,
      functionName: data.functionName,
      args: data.args,
    };
    setBatch((p: BatchState) => ({
      ...p,
      transactions: [...(p.transactions || []), transaction],
    }));
  };

  // const handleConnect = () => {
  //   try {
  //     connect({ ...args });
  //     setUser((prev: UserState) => ({ ...prev, account }));
  //   } catch (err) {
  //     console.error("Connection failed", err);
  //   }
  // };

  useEffect(() => {
    console.log("Batch Details:", { ...batch });
  }, [batch]);

  return (
    <Card className={cn("w-full")}>
      <div className="flex flex-col items-center p-4 pt-8">
        <CardHeader>
          <CardTitle className="text-center">
            {account?.address && account?.status === "connected"
              ? "Batch Transactions"
              : "Connect Wallet"}
          </CardTitle>
          <CardDescription className="text-center">
            {`Smart Wallets have many benefits, such as batching transactions.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="items-center w-full flex flex-col">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 flex flex-col items-center"
            >
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Contract Address</FormLabel>

                    <FormControl>
                      <Input placeholder="address" {...field} />
                    </FormControl>

                    <FormDescription>
                      {error && <>{error?.message}</>}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="abi"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>ABI</FormLabel>

                    <FormControl>
                      <Textarea rows={10} placeholder="abi" {...field} />
                    </FormControl>

                    <FormDescription>
                      {error && <>{error?.message}</>}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="functionName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Function Name</FormLabel>

                    <FormControl>
                      <Input placeholder="functionName" {...field} />
                    </FormControl>

                    <FormDescription>
                      {error && <>{error?.message}</>}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="args"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Arguments</FormLabel>

                    <FormControl>
                      <div className="flex flex-col gap-4 items-center">
                        {fields.map((field, index) => (
                          <Input
                            key={field.id}
                            placeholder={`Argument ${index + 1}`}
                            {...form.register(`args.${index}`)}
                          />
                        ))}
                        <div className="flex w-full justify-end">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="gap-1"
                            onClick={() => append("")}
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            Add Argument
                          </Button>
                        </div>
                      </div>
                    </FormControl>

                    <FormDescription>
                      {error && <>{error?.message}</>}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                size={"lg"}
                type="submit"
                variant={"secondary"}
                className="flex gap-2 items-center"
              >
                Add to Batch <PackagePlus className="h-5 w-5" />
              </Button>
            </form>
          </Form>
          {callsStatus && <div> Status: {callsStatus.status}</div>}
        </CardContent>
      </div>
      <CardFooter className="flex flex-col gap-4">
        {/* {mintMessage && (
          <MessageBadge title="Mint Message:" message={mintMessage} />
        )} */}
      </CardFooter>
    </Card>
  );
};

// const MessageBadge = ({
//   title,
//   message,
// }: {
//   title: string;
//   message: string | undefined;
// }) => (
//   <div className="flex flex-col items-center">
//     <Badge variant={"secondary"}>{title}</Badge>
//     <p className="text-xs max-w-sm break-all">{message || ""}</p>
//   </div>
// );

export default Batcher;
