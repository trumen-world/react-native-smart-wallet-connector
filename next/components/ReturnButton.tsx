"use client";

import { UserState } from "@/lib/hooks/use-user";
import { Button } from "./ui/button";

const ReturnButton = ({ user }: { user: UserState }) => {
  const returnToApp = () => {
    if (!user.address) {
      throw new Error("Missing address for iOS return!");
    }
    const addressParam = user.address
      ? `?address=${encodeURIComponent(user.address)}`
      : "";
    const validParam = user.signature?.valid
      ? `&valid=${user.signature?.valid}`
      : "";
    const signatureParam = user.signature?.hex
      ? `&signature=${encodeURIComponent(user.signature.hex)}`
      : "";
    const url = `RNCBSmartWallet://${addressParam}${signatureParam}${validParam}`;

    console.log("url", url);
    window.location.href = url;
  };
  return (
    <Button type="button" onClick={returnToApp}>
      Return to iOS
    </Button>
  );
};

export default ReturnButton;
