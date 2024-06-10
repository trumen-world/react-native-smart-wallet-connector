"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { Provider as JotaiProvider } from "jotai";
import { config } from "@/lib/chain/wagmi";

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>{props.children}</JotaiProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
