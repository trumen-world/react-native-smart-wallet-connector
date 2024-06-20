"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeToggleMobile } from "./ThemeToggleMobile";
import { Menu, Wallet } from "lucide-react";
import { ConnectSelect } from "./ConnectSelect";
import { useAccount } from "wagmi";
import useUser, { UserState } from "@/lib/hooks/use-user";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "./ui/badge";
import { Address } from "viem";

export default function Header() {
  const [user, setUser] = useUser();
  const account = useAccount();
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  const sheetOnOpenChange = () => {
    setSheetOpen(!sheetOpen);
  };

  useEffect(() => {
    if (account.address) {
      setUser((prevUser: UserState) => ({
        ...prevUser,
        address: account.address as Address,
      }));
    }
  }, [account.address, setUser, user.address]);

  return (
    <header className="sticky top-0 z-50 flex w-full h-16 justify-between items-center gap-2 border-b bg-background/10 backdrop-blur-[1px] px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:justify-between w-full md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          {/* TODO: ADD trumen world logo */}
          <Wallet className="w-8 h-8 text-indigo-700" />
          <h1 className="text-xl text-blue-600 tracking-tighter leading-3">
            CBSWRN
          </h1>
          <span className="sr-only">
            Coinbase Smart Wallet with React Native
          </span>
        </Link>
        <div className="flex gap-2 items-center mr-4">
          <Link href="/connect" className="text-lg font-semibold md:text-base">
            <Badge
              variant={"outline"}
              className="rounded-lg hover:border-2 hover:border-primary hover:shadow-md border-2 border-transparent"
            >
              Create
            </Badge>
          </Link>
          <Link href="/siwe" className="text-lg font-semibold md:text-base">
            <Badge
              variant={"outline"}
              className="rounded-lg hover:border-2 hover:border-primary hover:shadow-md  border-2 border-transparent"
            >
              SIWE
            </Badge>
          </Link>
          <Link href="/batch" className="text-lg font-semibold md:text-base">
            <Badge
              variant={"outline"}
              className="rounded-lg hover:border-2 hover:border-primary hover:shadow-md  border-2 border-transparent"
            >
              Batch
            </Badge>
          </Link>
        </div>
      </nav>
      {/* MOBILE */}
      <Link
        href="/"
        className="flex md:hidden items-center gap-2 text-lg font-semibold md:text-base"
      >
        <Wallet className="w-6 h-6 text-indigo-700" />
        <p className="text-primary tracking-tighter leading-3 text-xs max-w-[150px]">
          CBSWRN
        </p>
      </Link>
      <div className="flex gap-2">
        <Sheet open={sheetOpen} onOpenChange={sheetOnOpenChange}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="shrink-0 md:hidden border bg-background text-foreground dark:hover:bg-stone-900 hover:bg-stone-100"
              onClick={sheetOnOpenChange}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <div className="flex flex-col gap-2 items-start w-full">
                <Link
                  href="/"
                  className="flex w-full items-center gap-2 text-lg font-semibold text-primary"
                  onClick={sheetOnOpenChange}
                >
                  <Wallet className="w-6 h-6 text-indigo-700" />
                  <h1>CBSWRN</h1>
                  <span className="sr-only">
                    Coinbase Smart Wallet with React Native
                  </span>
                </Link>
                <Link
                  href="/connect"
                  className="text-lg w-full flex font-semibold md:text-base"
                  onClick={sheetOnOpenChange}
                >
                  <Badge
                    variant={"outline"}
                    className="rounded-lg text-base w-1/2 text-center items-center flex flex-col hover:border-2  hover:border-primary hover:shadow-md  border-2 border-transparent"
                  >
                    Connect
                  </Badge>
                </Link>
                <Link
                  href="/siwe"
                  className="text-lg w-full flex font-semibold md:text-base"
                  onClick={sheetOnOpenChange}
                >
                  <Badge
                    variant={"outline"}
                    className="rounded-lg text-base w-1/2 text-center items-center flex flex-col hover:border-2 hover:border-primary hover:shadow-md  border-2 border-transparent"
                  >
                    SIWE
                  </Badge>
                </Link>
                <Link
                  href="/batch"
                  className="text-lg w-full flex font-semibold md:text-base"
                  onClick={sheetOnOpenChange}
                >
                  <Badge
                    variant={"outline"}
                    className="rounded-lg text-base w-1/2 text-center items-center flex flex-col hover:border-2 hover:border-primary hover:shadow-md  border-2 border-transparent"
                  >
                    Batch
                  </Badge>
                </Link>
              </div>
              {/* <Link
                href="/create"
                className="text-muted-foreground hover:text-foreground"
                onClick={sheetOnOpenChange}
              >
                Create Wallet
              </Link> */}
              {/* <Link
                href="/sign"
                className="text-muted-foreground hover:text-foreground"
                onClick={sheetOnOpenChange}
              >
                SIWE
              </Link> */}
              <ThemeToggleMobile />
            </nav>
          </SheetContent>
        </Sheet>
        <ConnectSelect />
      </div>
      <div className="md:flex hidden">
        <ThemeToggle />
      </div>
    </header>
  );
}
