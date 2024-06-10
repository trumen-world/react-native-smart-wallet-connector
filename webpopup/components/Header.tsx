"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeToggleMobile } from "./ThemeToggleMobile";
import { Globe, Menu } from "lucide-react";
import { ConnectSelect } from "./ConnectSelect";
import useUser from "@/lib/hooks/use-user";
import { useAccount } from "wagmi";

export default function Header() {
  const [user] = useUser();
  const account = useAccount();
  user.account = account;

  return (
    <header className="sticky top-0 flex w-full h-16 items-center gap-4 border-b bg-background/10 backdrop-blur-[1px] px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:justify-between w-full md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          {/* TODO: ADD trumen world logo */}
          <Globe className="h-6 w-6" />
          <h1 className="text-2xl">trumen</h1>
          <span className="sr-only">trumen world</span>
        </Link>
        {/* <div className="flex items-center gap-6">
          <Link
            href="#"
            className="hover:text-muted-foreground transition-colors text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="hover:text-muted-foreground transition-colors text-foreground"
          >
            Rebase History
          </Link>
          <Link
            href="#"
            className="hover:text-muted-foreground transition-colors text-foreground"
          >
            {`Price & Supply`}
          </Link>
        </div> */}
      </nav>
      {/* MOBILE */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
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
              <Globe className="h-6 w-6" />
              <span className="sr-only">trumen world</span>
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Rebase History
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              {`Price & Supply`}
            </Link>
            <Link href="#" className="hover:text-foreground">
              Settings
            </Link>
            <ThemeToggleMobile />
          </nav>
        </SheetContent>
      </Sheet>
      <ConnectSelect account={user.account} />
      <div className="flex md:hidden items-center gap-1 absolute left-1/2 -translate-x-1/2">
        <Globe className="w-4 h-4 text-amber-500" />
        <p className="text-blue-300">trumen</p>
      </div>
      <div className="md:flex hidden">
        <ThemeToggle />
      </div>
    </header>
  );
}
