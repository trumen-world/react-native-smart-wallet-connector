"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useBatch, { BatchState, Transaction } from "@/lib/hooks/use-batch";
import { Button } from "./ui/button";
import { Dna, Trash } from "lucide-react";
import BatchSubmitForm from "./BatchSubmitForm";

export default function TxTable() {
  const [batch, setBatch] = useBatch();
  const deleteTx = (i: number) => {
    setBatch((p: BatchState) => ({
      ...p,
      transactions: p.transactions?.filter((_, index) => index !== i) || [],
    }));
  };
  const duplicateTx = (i: number) => {
    setBatch((p: BatchState) => {
      const transactionToDuplicate = p.transactions?.[i];
      if (!transactionToDuplicate) return p;

      return {
        ...p,
        transactions: [
          ...(p.transactions || []),
          { ...transactionToDuplicate },
        ],
      };
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-7">
        <CardTitle>Batch List</CardTitle>
        <CardDescription>
          The transactions in the current batch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>To</TableHead>
              <TableHead className="hidden sm:table-cell">
                Function Name
              </TableHead>
              <TableHead className="hidden md:table-cell">Arguments</TableHead>
              <TableHead className="hidden md:table-cell">ABI</TableHead>
              <TableHead className="hidden md:table-cell"></TableHead>
              <TableHead className="hidden md:table-cell"></TableHead>
              {/* <TableHead className="hidden sm:table-cell">Status</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {batch.transactions?.map((t, i) => (
              <TableRow key={i} className="bg-accent">
                <TableCell>
                  <div className="text-xs font-light tracking-tighter">
                    {t.address.slice(0, 6)}...
                    {t.address.slice(t.address.length - 4, t.address.length)}
                  </div>
                </TableCell>
                <TableCell className="hidden font-bold tracking-tighter sm:table-cell">
                  {t.functionName}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <code>{JSON.stringify(t.args, null, 2)} </code>
                  {/* <Dialog>
                    <DialogTrigger>
                      <Badge variant="secondary" className="rounded-sm">
                        View
                      </Badge>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Arguments</DialogTitle>
                        <DialogDescription>
                          <code>{JSON.stringify(t.args, null, 2)} </code>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog> */}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Dialog>
                    <DialogTrigger>
                      <Badge variant="secondary" className="rounded-sm">
                        View
                      </Badge>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>ABI</DialogTitle>
                        <DialogDescription>
                          <code>{JSON.stringify(t.abi, null, 2)}</code>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Button
                    variant={"outline"}
                    className="p-1 px-3"
                    onClick={() => duplicateTx(i)}
                  >
                    <Dna className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="table-cell text-right">
                  <Button
                    variant={"destructive"}
                    className="p-1 px-3"
                    onClick={() => deleteTx(i)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        {batch.transactions && batch.transactions.length > 0 && (
          <BatchSubmitForm />
        )}
      </CardFooter>
    </Card>
  );
}
