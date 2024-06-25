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
import useBatch, { BatchState, Transaction } from "@/lib/hooks/use-batch";
import { useWriteContracts } from "wagmi/experimental";
import { Fingerprint } from "lucide-react";
import useUser from "@/lib/hooks/use-user";
import { useEffect } from "react";
import { client } from "@/lib/chain/viem";
import { BaseError, ContractFunctionRevertedError } from "viem";

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

const BatchSubmitForm = () => {
  const [user] = useUser();
  const [batch, setBatch] = useBatch();
  const { writeContracts } = useWriteContracts();

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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("BATCH FORM", data);
    if (!batch.transactions || !user.address) return;
    form.reset({ transactions: batch.transactions });

    const validTransactions: Transaction[] = [];
    for (const transaction of batch.transactions) {
      try {
        const result = await client.simulateContract({
          ...transaction,
          account: user.address,
        });
        console.log("simulation result", result);
        if (result) {
          validTransactions.push(transaction);
        }
      } catch (err) {
        if (err instanceof BaseError) {
          const revertError = err.walk(
            (err) => err instanceof ContractFunctionRevertedError,
          );
          if (revertError instanceof ContractFunctionRevertedError) {
            const errorName = revertError.data?.errorName ?? "";
            // do something with `errorName`
          }
        }
      }
    }

    console.log(validTransactions);
    // Update the batch state with valid transactions
    setBatch((prev: BatchState) => ({
      ...prev,
      transactions: validTransactions,
    }));

    // Submit valid transactions
    if (validTransactions.length > 0) {
      writeContracts({
        contracts: validTransactions,
      });
    }
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

export default BatchSubmitForm;
