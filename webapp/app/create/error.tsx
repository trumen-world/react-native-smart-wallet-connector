"use client";

import Page from "@/components/Page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Page>
      <p className="p-4 flex flex-col w-72 text-center">
        <span className="text-blue-500 font-bold">CREATE ERROR</span>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        {/* <Link
          href={"/create"}
          className="italic text-sky-500 dark:text-sky-300"
        >
          Please Try Again
        </Link> */}
      </p>
    </Page>
  );
}
