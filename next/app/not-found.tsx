"use client";

import Page from "@/components/Page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFoundPage() {
  return (
    <Page>
      <p className="p-4 flex flex-col w-72 text-center">
        <span className="dark:text-amber-500 text-amber-800 font-bold">
          PAGE NOT FOUND
        </span>
      </p>
    </Page>
  );
}
