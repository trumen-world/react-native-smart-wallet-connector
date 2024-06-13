import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { config } from "./chain/wagmi";
import {
  Address,
  PublicClient,
  WalletClient,
  createWalletClient,
  custom,
} from "viem";
import { base } from "viem/chains";
import { client, walletClient } from "./chain/viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChainName(chainId: number) {
  return config.chains.find((chain) => chain.id === chainId)?.name || null;
}

export function handleAppReturn() {
  const appUrl = `RNCBSmartWallet://`;
  window.location.href = appUrl;
}

export const signSiweMessage = async (account: Address, message: string) => {
  if (message && walletClient && account) {
    try {
      const signature = await walletClient.signMessage({
        account,
        message,
      });
      console.log("SIGNATURE: ", signature);
      return signature;
    } catch (error) {
      console.error("Error signing message: ", error);
    }
  }
};

export const verifySiweSignature = async (
  address: Address,
  signature: `0x${string}`,
  message: string,
) => {
  const walletClient = createWalletClient({
    chain: base,
    transport: custom(window.ethereum),
  });
  console.log(message);
  console.log(walletClient);
  if (message && address && walletClient) {
    try {
      const valid = await client.verifyMessage({
        address,
        message: message,
        signature,
      });
      if (valid) {
        console.log("✅ VALID SIGNATURE");
        console.log(signature);
        return valid;
      }
    } catch (error) {
      console.error("Error verifying message: ", error);
    }
  }
};
