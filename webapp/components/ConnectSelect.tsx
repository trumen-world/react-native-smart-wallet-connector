"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useConnect, useDisconnect, UseAccountReturnType } from "wagmi";
import { useEffect, useState } from "react";
import useUser, { ConnectionStatus } from "@/lib/hooks/use-user";
import { cn, getChainName } from "@/lib/utils";

const STATUS_COLORS = {
  connected: "bg-lime-600 dark:bg-lime-300",
  connecting: "bg-sky-600 dark:bg-sky-500",
  disconnected: "bg-red-700 dark:bg-red-500",
  reconnecting: "bg-orange-600 dark:bg-orange-500",
};

const FormSchema = z.object({
  connector: z.string(),
});

export function ConnectSelect({
  account,
}: {
  account: UseAccountReturnType | null;
}) {
  const { connectors, connect, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [user, setUser] = useUser();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [align, setAlign] = useState<"start" | "end">("end");

  useEffect(() => {
    function handleResize() {
      setAlign(window.innerWidth <= 768 ? "start" : "end");
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const connector = connectors.find(
      (connector) => connector.name === data.connector,
    );
    if (connector) connect({ connector });
    setDialogOpen(false);

    toast({
      title: "Connecting with:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(user)}</code>
        </pre>
      ),
    });
  }

  function handleJumpToRNApp() {
    if (!account?.addresses) return;

    const appUrl = `RNCBSmartWallet://address?address=${encodeURIComponent(account.addresses[0])}`;
    console.log("appUrl", appUrl);
    window.location.href = appUrl;

    return;
  }

  function handleDisconnect() {
    disconnect();
    setUser({
      account: null,
      balance: null,
      connectionStatus: ConnectionStatus.DISCONNECTED,
      name: null,
    });
    setDialogOpen(false);
  }

  function handleConnection() {
    if (account?.status === "disconnected") {
      setUser({
        account,
        balance: user.balance,
        connectionStatus: ConnectionStatus.DISCONNECTED,
        name: user.name,
      });
    } else if (account?.status === "connected") {
      setUser({
        account,
        balance: user.balance,
        connectionStatus: ConnectionStatus.CONNECTED,
        name: user.name,
      });
    }
    setDialogOpen(true);
  }

  if (!account) {
    return <div>No Account</div>;
  }

  const transport = account.chainId ? getChainName(account.chainId) : null;

  return (
    <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="bg-background border-2 rounded-full"
            >
              {account.status === "connected" ? (
                <CircleUser className="h-5 w-5" />
              ) : (
                <UserRoundX className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align={align} className="-translate-x-4">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-2">
                <p>My Account</p>
                {account.status && (
                  <div className="flex items-center gap-1">
                    <div
                      className={cn(
                        STATUS_COLORS[account.status] || "",
                        "h-2 w-2 rounded-full",
                      )}
                    />
                    <span className="font-light text-xs flex items-center gap-1 capitalize">
                      : {account.status}
                    </span>
                  </div>
                )}
                {account.addresses && (
                  <p className="font-light text-xs overflow-clip">
                    {account.addresses[0]}
                  </p>
                )}

                {account.chainId && (
                  <p className="font-light text-xs">
                    Chain ID: {account.chainId} - {transport}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            {account.addresses && (
              <DropdownMenuItem onClick={handleJumpToRNApp}>
                Back to App
              </DropdownMenuItem>
            )}

            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleConnection}
              className={cn(
                "mt-1",
                account.status === "connected" ? "bg-red-700 text-white" : "",
              )}
            >
              {account.status === "disconnected" ? (
                <span>Connect</span>
              ) : (
                <span>Disconnect</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          {user.connectionStatus === ConnectionStatus.DISCONNECTED && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <DialogHeader>
                  <FormField
                    control={form.control}
                    name="connector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <DialogTitle>Select your wallet.</DialogTitle>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a wallet provider" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {connectors.map((connector) => (
                              <SelectItem
                                key={connector.uid}
                                value={connector.name}
                              >
                                {connector.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {error && <>{error?.message}</>}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogDescription>
                    {`Don't have a wallet? Get one here.`}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="submit">Connect</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
          {user.connectionStatus === ConnectionStatus.CONNECTED && (
            <div>
              <DialogHeader>
                <DialogTitle>Are you sure you want to disconnect?</DialogTitle>
                <DialogDescription>
                  You can reconnect your wallet again at a later point in time.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
