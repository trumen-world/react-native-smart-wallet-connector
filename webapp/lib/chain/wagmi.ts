import { HttpTransport } from "viem";
import { http, createConfig } from "wagmi";
import { base, baseSepolia, mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export type TransportConfig = Record<typeof baseSepolia.id, HttpTransport>;

export const transports: TransportConfig = {
  [baseSepolia.id]: http(),
};

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "Trumen World",
      preference: "smartWalletOnly",
    }),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
  ],
  ssr: true,
  transports,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
