import { HttpTransport } from "viem";
import { http, createConfig } from "wagmi";
import { base, mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export type TransportConfig = Record<typeof base.id, HttpTransport>;

export const transports: TransportConfig = {
  [base.id]: http(),
};

export const config = createConfig({
  chains: [base],
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

export const swConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "Trumen World",
      preference: "smartWalletOnly",
    }),
  ],
  transports: { [base.id]: http() },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
