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

const Skeleton = () => {
  return (
    <Card
      className={cn(
        "m-2 w-5/6 sm:w-2/3 md:w-1/2 lg:max-w-xl",
        "border-gray-300 bg-gray-50 dark:bg-gray-800",
      )}
    >
      <div className="flex flex-col items-center p-4 pt-8 sm:flex-row">
        <CardHeader>
          <CardTitle className="text-center">Loading...</CardTitle>
          <CardDescription className="text-center">...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button type="button" disabled>
            Loading...
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default Skeleton;
