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
import useBatch, { Transaction } from "@/lib/hooks/use-batch";
import { useCallsStatus, useWriteContracts } from "wagmi/experimental";
import { Fingerprint } from "lucide-react";
import useUser from "@/lib/hooks/use-user";
import { useAccount } from "wagmi";
import { useEffect } from "react";

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

const BatchForm = () => {
  const [user] = useUser();
  const [batch, setBatch] = useBatch();
  // const { address } = useAccount();
  const { data: id, writeContracts } = useWriteContracts();
  // const { data: callsStatus } = useCallsStatus({
  //   id: id as string,
  //   query: {
  //     enabled: !!id,
  //     // Poll every second until the calls are confirmed
  //     refetchInterval: (data) =>
  //       data.state.data?.status === "CONFIRMED" ? false : 1000,
  //   },
  // });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      transactions: [],
    },
  });

  useEffect(() => {
    if (!user.address) return;
    setBatch({
      transactions: [
        {
          address: "0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
          abi: [
            {
              name: "safeMint",
              type: "function",
              stateMutability: "view",
              inputs: [
                {
                  type: "address",
                  name: "recipient",
                },
              ],
              outputs: [],
            },
          ],
          functionName: "safeMint",
          args: [user.address],
        },
        {
          address: "0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
          abi: [
            {
              name: "safeMint",
              type: "function",
              stateMutability: "view",
              inputs: [
                {
                  type: "address",
                  name: "recipient",
                },
              ],
              outputs: [],
            },
          ],
          functionName: "safeMint",
          args: [user.address],
        },
      ],
    });
  }, [user.address, setBatch]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // console.log("ABI", transactions[0].abi);
    console.log("BATCH FORM", data);
    // console.log([...transactions]);
    if (!batch.transactions) return;
    form.reset({ transactions: batch.transactions });
    writeContracts({
      contracts: batch.transactions,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center space-y-8"
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

        <Button size={"lg"} type="submit" className="flex items-center gap-2">
          Confirm Batch <Fingerprint className="h-5 w-5" />
        </Button>
      </form>
    </Form>
  );
};

export default BatchForm;
