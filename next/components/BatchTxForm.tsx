"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useAccount, useConnect } from "wagmi";
import { cn } from "@/lib/utils";
import useUser from "@/lib/hooks/use-user";
import useBatch, { BatchState } from "@/lib/hooks/use-batch";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { PackagePlus, PlusCircle, Trash } from "lucide-react";
import { Input } from "./ui/input";
import { parseAbi, parseAbiItem } from "viem";

const FormSchema = z.object({
  address: z.string(),
  abi: z.any(),
  args: z.string().array(),
});

const BatchTxForm = () => {
  const [user] = useUser();
  const [batch, setBatch] = useBatch();

  const { error } = useConnect();
  const account = useAccount();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: "0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
      abi: ["function safeMint(address to)"],
      args: [],
    },
  });

  useEffect(() => {
    if (!user.address) return;
    form.reset({
      address: "0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
      abi: ["function safeMint(address to)"],
      args: [user.address],
    });
  }, [user.address, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "args" as never,
  });

  const deleteArgument = (index: number) => {
    remove(index);
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form Data Submitted:", data);
    const parsedAbi = parseAbi(data.abi);
    const transaction = {
      address: data.address as `0x${string}`,
      abi: parsedAbi,
      functionName: Object.values(parsedAbi[0])[0] as string,
      args: data.args,
    };
    setBatch((p: BatchState) => ({
      ...p,
      transactions: [...(p.transactions || []), transaction],
    }));
  };

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
        <CardContent className="flex w-full flex-col items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col items-center space-y-6"
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
                    <FormLabel>Function</FormLabel>

                    <FormControl>
                      <Input
                        placeholder={"penis"}
                        {...field}
                        onClick={() => {
                          console.log(field.value);
                          console.log(
                            parseAbiItem("function safeMint(address to)"),
                          );
                        }}
                      />
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
                      <div className="flex flex-col items-center gap-4">
                        {fields.map((field, i) => (
                          <div
                            key={field.id}
                            className="flex w-full items-center gap-4"
                          >
                            <Input
                              placeholder={`Argument ${i + 1}`}
                              {...form.register(`args.${i}`)}
                            />
                            <Button
                              variant={"destructive"}
                              className="p-1 px-3"
                              onClick={() => deleteArgument(i)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
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
                className="flex items-center gap-2"
              >
                Add to Batch <PackagePlus className="h-5 w-5" />
              </Button>
            </form>
          </Form>
          {/* {callsStatus && <div> Status: {callsStatus.status}</div>} */}
        </CardContent>
      </div>
    </Card>
  );
};

export default BatchTxForm;