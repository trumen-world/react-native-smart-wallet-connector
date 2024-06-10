"use client";

import { Card } from "@/components/ui/card";
import useUser from "@/lib/hooks/use-user";
import { AppWindowMac, Copy, Globe } from "lucide-react";

export default function AddressCard() {
  const [user] = useUser();
  return (
    <Card className="flex flex-col items-center w-full gap-4 p-4">
      <div className="flex w-full">
        <AppWindowMac className="w-8 h-8" />
      </div>
      <div className="flex flex-col w-full gap-4">
        <div className="flex justify-between w-full items-center gap-4">
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <p className="text-secondary-foreground">Address</p>
            </div>
            <p className="text-xs text-secondary-foreground">
              {user.account?.address}
            </p>
          </div>
          <Copy />
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 items-center">
            <Globe className="h-3 w-3" />
            <p className="text-secondary-foreground">TRU</p>
          </div>
          <p>3,950,234</p>
        </div>
      </div>
    </Card>
  );
}
