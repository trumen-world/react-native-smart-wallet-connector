import { HttpTransport } from "viem";
import { http, createConfig } from "wagmi";
import { base, mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export type TransportConfig = Record<
  typeof mainnet.id | typeof base.id,
  HttpTransport
>;

export const transports: TransportConfig = {
  [mainnet.id]: http(),
  [base.id]: http(),
};

export const config = createConfig({
  chains: [mainnet, base],
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
