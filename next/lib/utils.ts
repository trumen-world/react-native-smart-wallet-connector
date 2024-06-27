import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { config } from "./chain/wagmi";
import { APP } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChainName(chainId: number) {
  return config.chains.find((chain) => chain.id === chainId)?.name || null;
}

export function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000);
}
