import { coinbaseWallet } from "wagmi/connectors";

export const NULL_USER = {
  account: null,
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
