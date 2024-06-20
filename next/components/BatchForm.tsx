"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Transaction } from "@/lib/hooks/use-batch";
import { useAccount } from "wagmi";
import { useCallsStatus, useWriteContracts } from "wagmi/experimental";
import { Fingerprint } from "lucide-react";

const FormSchema = z.object({
  transactions: z
    .object({
      address: z.string(),
      abi: z.any(),
      functionName: z.string(),
      args: z.string().array(),
    })
    .array(),
});

const BatchForm = ({ transactions }: { transactions: Transaction[] }) => {
  const account = useAccount();
  const { data: id, writeContracts } = useWriteContracts();
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
      transactions: [
        ...transactions,

        // {
        //   address: data.address as `0x${string}`,
        //   abi: JSON.parse(data.abi),
        //   functionName: data.functionName,
        //   args: JSON.parse(data.args),
        // },
      ],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("ABI", transactions[0].abi);
    console.log("BATCH FORM", data);
    console.log([...transactions]);
    writeContracts({
      contracts: transactions.map((transaction) => {
        console.log(transaction.abi);
        return {
          ...transaction,
          abi: transaction.abi,
        };
      }),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 items-center flex flex-col w-full"
      >
        <FormField
          control={form.control}
          name="transactions"
          render={({ field }) => (
            <FormControl>
              <FormItem>
                <FormMessage />
              </FormItem>
            </FormControl>
          )}
        />

        <Button size={"lg"} type="submit" className="flex gap-2 items-center">
          Confirm Batch <Fingerprint className="h-5 w-5" />
        </Button>
      </form>
    </Form>
  );
};

export default BatchForm;
