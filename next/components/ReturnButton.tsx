"use client";

import { Button } from "./ui/button";
import useApp from "@/lib/hooks/use-app";

const ReturnButton = () => {
  const [app] = useApp();
  const returnToApp = () => {
    if (!app.url) {
      console.error("Missing URL for app return!");
      return;
    }

    window.location.href = app.url;
  };
  return (
    <Button variant={"link"} type="button" onClick={returnToApp}>
      Return to App
    </Button>
  );
};

export default ReturnButton;
