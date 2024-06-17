"use client";

import { UserState } from "@/lib/hooks/use-user";
import { Button } from "./ui/button";

const ReturnButton = ({ user }: { user: UserState }) => {
  const returnToApp = () => {
    if (!user.account?.address) {
      throw new Error("Missing address for iOS return!");
    }
    const appUrl = `RNCBSmartWallet://address?address=${encodeURIComponent(user.account.address)}&signature=${user.signature?.hex ? encodeURIComponent(user.signature.hex) : ""}`;
    console.log("appUrl", appUrl);
    window.location.href = appUrl;
  };
  return (
    <Button type="button" onClick={returnToApp}>
      Return to iOS
    </Button>
  );
};

export default ReturnButton;
