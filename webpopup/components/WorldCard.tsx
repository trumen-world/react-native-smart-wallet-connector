"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useUser from "@/lib/hooks/use-user";
import { CloudFog, Footprints, Gift, Globe } from "lucide-react";

export default function WorldCard() {
  const [user] = useUser();
  return (
    <Card className="flex flex-col items-center w-full gap-4 p-4">
      <div className="flex w-full">
        <div>
          <h4 className="text-xl font-semibold">My World</h4>
        </div>
      </div>

      <div className="flex justify-between w-full items-center">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <Footprints className="h-4 w-4" />
              <p>Fog</p>
            </div>
            <p>12400/15000</p>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-1 items-center">
              <CloudFog className="h-4 w-4" />
              <p>Fog</p>
            </div>
            <p>12400/15000</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Globe className="w-40 h-40" />
          <p className="flex items-center gap-1">
            Lv <span className="text-lg font-bold">128</span>
            <span className="bg-background p-1 px-2 dark:text-primary-foreground text-xs invert ml-1">
              +95%
            </span>
          </p>
        </div>
      </div>

      <div className="flex w-full">
        <Button
          type="button"
          className="rounded-full flex gap-2 bg-primary-foreground text-secondary-foreground dark:text-black hover:opacity-90 hover:bg-primary-foreground/50"
        >
          <Gift className="w-4 h-4" />
          <p>TruAirdrop</p>
        </Button>
      </div>
    </Card>
  );
}
