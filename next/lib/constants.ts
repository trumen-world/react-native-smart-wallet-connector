import { coinbaseWallet } from "wagmi/connectors";

export const NULL_USER = {
  address: null,
  balance: null,
  name: null,
  signature: {
    hex: null,
    valid: null,
  },
};

export const CHAIN_OPTS = {
  chainId: 84532 as const,
  connector: coinbaseWallet({
    appName: "Coinbase Smart Wallet w/ React Native",
    preference: "smartWalletOnly",
    chainId: 84532,
  }),
};

export const domain = {
  name: "Ether Mail",
  version: "1",
  chainId: 84532,
  verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
} as Record<string, unknown>;

// The named list of all type definitions
export const types = {
  Person: [
    { name: "name", type: "string" },
    { name: "wallet", type: "address" },
  ],
  Mail: [
    { name: "from", type: "Person" },
    { name: "to", type: "Person" },
    { name: "contents", type: "string" },
  ],
} as const;
