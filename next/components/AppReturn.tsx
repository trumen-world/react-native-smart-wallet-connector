"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";

const AppReturn = ({
  appUrl = `RNCBSmartWallet://`,
  title = "Return to React Native App",
  message,
  description = "Click to return.",
}: {
  appUrl?: string;
  title?: string;
  message?: string;
  description?: string;
}) => {
  const HANDLE_APP_RETURN = () => {
    window.location.href = appUrl;
  };
  return (
    <Card className="m-2">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="items-center flex flex-col">
        <Button onClick={HANDLE_APP_RETURN}>Return to App</Button>
      </CardContent>
      <CardFooter className="text-xs text-center">{message}</CardFooter>
    </Card>
  );
};

export default AppReturn;
