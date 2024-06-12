"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeToggleMobile } from "./ThemeToggleMobile";
import { Menu, Wallet } from "lucide-react";
import { ConnectSelect } from "./ConnectSelect";
import { useAccount } from "wagmi";
import useUser from "@/lib/hooks/use-user";

export default function Header() {
  const [user] = useUser();
  const account = useAccount();
  user.account = account;

  return (
    <header className="sticky top-0 flex w-full h-16 justify-between items-center gap-2 border-b bg-background/10 backdrop-blur-[1px] px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:justify-between w-full md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          {/* TODO: ADD trumen world logo */}
          <Wallet className="w-8 h-8 text-indigo-700" />
          <h1 className="text-xl text-blue-600 tracking-tighter leading-3">
            Coinbase Smart Wallet with React Native
          </h1>
          <span className="sr-only">
            Coinbase Smart Wallet with React Native
          </span>
        </Link>
      </nav>
      {/* MOBILE */}
      <div className="flex md:hidden items-center gap-2">
        <Wallet className="w-6 h-6 text-indigo-700" />
        <p className="text-blue-600 tracking-tighter leading-3 text-xs max-w-[150px]">
          Coinbase Smart Wallet with React Native
        </p>
      </div>
      <div className="flex gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="shrink-0 md:hidden border bg-background text-foreground dark:hover:bg-stone-900 hover:bg-stone-100"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Wallet className="w-6 h-6 text-indigo-700" />
                <span className="sr-only">
                  Coinbase Smart Wallet with React Native
                </span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <ThemeToggleMobile />
            </nav>
          </SheetContent>
        </Sheet>
        <ConnectSelect account={user.account} />
      </div>
      <div className="md:flex hidden">
        <ThemeToggle />
      </div>
    </header>
  );
}