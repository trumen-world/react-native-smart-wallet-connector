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
import { client } from "./chain/viem";

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

export const signSiweMessage = async (message: string) => {
  const walletClient = createWalletClient({
    chain: base,
    transport: custom(window.ethereum),
  });
  const [account] = await walletClient.getAddresses();
  console.log(message);
  console.log(account);
  console.log(walletClient);
  if (message && account && walletClient) {
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
  signature: `0x${string}`,
  message: string,
) => {
  const walletClient = createWalletClient({
    chain: base,
    transport: custom(window.ethereum),
  });
  const [address] = await walletClient.getAddresses();
  console.log(message);
  console.log(address);
  console.log(walletClient);
  if (message && address && walletClient) {
    try {
      const valid = await client.verifyMessage({
        address,
        message: message,
        signature,
      });
      if (valid) console.log("✅ VALID SIGNATURE");
      return valid;
    } catch (error) {
      console.error("Error verifying message: ", error);
    }
  }
};
