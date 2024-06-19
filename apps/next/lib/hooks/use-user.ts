import { atom, useAtom } from "jotai";
import { Hex } from "viem";
import { UseAccountReturnType } from "wagmi";

export type UserState = {
  account: UseAccountReturnType | null;
  balance?: bigint | null;
  name?: string | null;
  signature?: {
    hex: Hex | null;
    valid: boolean | null;
  };
};

const configAtom = atom<UserState>({
  account: null,
  balance: BigInt(0),
  name: null,
});

export default function useUser() {
  return useAtom(configAtom);
}
