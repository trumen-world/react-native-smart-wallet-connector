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
import { CircleUser, Cog, Moon, Sun, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  useConnect,
  useDisconnect,
  useAccount,
  Connector,
  UseAccountReturnType,
} from "wagmi";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useUser, { UserState } from "@/lib/hooks/use-user";
import { cn, getChainName } from "@/lib/utils";
import { APP, NULL_USER } from "@/lib/constants";
import { coinbaseWallet } from "wagmi/connectors";
import { Address } from "viem";
import { useTheme } from "next-themes";

const STATUS_COLORS = {
  connected: "bg-lime-600 dark:bg-lime-300",
  connecting: "bg-sky-600 dark:bg-sky-500",
  disconnected: "bg-red-700 dark:bg-red-500",
  reconnecting: "bg-orange-600 dark:bg-orange-500",
};

export function ConnectSelect() {
  const { connect } = useConnect();
  const { setTheme } = useTheme();
  const { disconnect } = useDisconnect();
  const [user, setUser] = useUser();
  const account = useAccount();
  const chainId = 84532;
  const connector = coinbaseWallet({
    appName: "Coinbase Smart Wallet w/ React Native",
    preference: "smartWalletOnly",
    chainId,
  });

  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<"start" | "end">("end");

  useEffect(() => {
    function handleResize() {
      setAlign(window.innerWidth <= 768 ? "start" : "end");
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleJumpToRNApp = () => {
    if (!account.address) return;

    const appUrl = `${APP.deeplink}address?address=${encodeURIComponent(account.address)}`;
    console.log("appUrl", appUrl);
    window.location.href = appUrl;
  };

  const handleDisconnect = () => {
    disconnect();
    setUser(NULL_USER);
    setOpen(false);
  };

  const handleConnect = () => {
    connect({ chainId, connector });
    setUser((prevState: UserState) => ({
      ...prevState,
      address: account.address as Address,
    }));
  };

  return (
    <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full border-2 border-accent bg-background"
            >
              <CircleUser
                className={cn(
                  "h-5 w-5",
                  account.isConnected ? "opacity-100" : "opacity-50",
                )}
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
            {/* <AvatarTrigger open={open} setOpen={setOpen} account={account} /> */}
          </DropdownMenuTrigger>

          <DropdownMenuContent align={align} className="-translate-x-4">
            <DropdownMenuLabel>
              <AccountInfo account={account} />
            </DropdownMenuLabel>
            <div className="flex items-center gap-2">
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="flex w-full justify-center"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="flex w-full justify-center"
              >
                <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="flex w-full justify-center"
              >
                <Cog className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90" />
              </DropdownMenuItem>
            </div>
            {account.address && (
              <DropdownMenuItem onClick={handleJumpToRNApp}>
                Back to App
              </DropdownMenuItem>
            )}
            {!account.isConnected ? (
              <DropdownMenuItem
                onClick={handleConnect}
                className={cn(
                  "mt-1",
                  account.isConnected ? "bg-red-700 text-white" : "",
                )}
              >
                Connect
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleDisconnect}
                className={cn(
                  "mt-1",
                  account.isConnected ? "bg-red-700 text-white" : "",
                )}
              >
                Disconnect
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    </div>
  );
}

const AvatarTrigger = ({
  account,
  open,
  setOpen,
}: {
  account: UseAccountReturnType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      className="h-9 w-9 rounded-full border-2 bg-background"
      onClick={() => setOpen(open)}
    >
      {account.isConnected ? (
        <CircleUser className="h-5 w-5" />
      ) : (
        <UserRoundX className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle user menu</span>
    </Button>
  );
};

const AccountInfo = ({ account }: { account: UseAccountReturnType }) => {
  const transport = account.chainId ? getChainName(account.chainId) : null;
  return (
    <div className="flex flex-col gap-2">
      <p>My Account</p>

      <div className="flex items-center gap-1">
        <div
          className={cn(
            STATUS_COLORS[account.status] || "",
            "h-2 w-2 rounded-full",
          )}
        />
        <span className="flex items-center gap-1 text-xs font-light capitalize">
          : {account.status}
        </span>
      </div>

      {account.address && (
        <p className="overflow-clip text-xs font-light">{account.address}</p>
      )}

      {account.chainId && (
        <p className="text-xs font-light">
          Chain ID: {account.chainId} - {transport}
        </p>
      )}
    </div>
  );
};
