import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const SignerSkeleton = () => {
  return (
    <Card className={cn("m-2", "border-gray-300 bg-gray-50 dark:bg-gray-800")}>
      <div className="flex flex-col sm:flex-row items-center p-4 pt-8">
        <CardHeader>
          <CardTitle className="text-center">Loading Signer...</CardTitle>
          <CardDescription className="text-center">
            Please wait.
          </CardDescription>
        </CardHeader>
        <CardContent className="items-center flex flex-col">
          <Button type="button" disabled>
            Loading...
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default SignerSkeleton;
