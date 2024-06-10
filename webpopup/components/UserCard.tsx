"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useUser from "@/lib/hooks/use-user";

export default function UserCard() {
  const [user] = useUser();
  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-4">
        <Avatar>
          {/* <AvatarImage src=""/> */}
          <AvatarFallback>MP</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-sm font-semibold">
            {user.name ?? "Matthew Pryor"}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[128px] truncate">
            {user.account?.address}
          </p>
        </div>
      </div>
      {/* THIS DOES NOT SIGN OUT USER AT THE MOMENT, JUST A PLACEHOLDER */}
      <Button variant="secondary" size="sm">
        Sign out
      </Button>
    </Card>
  );
}
