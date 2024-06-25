import { atom, useAtom } from "jotai";
import { Address, Hex } from "viem";

export type UserState = {
  address: Address | null;
  balance?: bigint | null;
  name?: string | null;
  siweSignature?: {
    hex: Hex | null;
    valid: boolean | null;
  };
  typedDataSignature?: {
    hex: Hex | null;
    valid: boolean | null;
  };
  permitSignature?: {
    hex: Hex | null;
    valid: boolean | null;
  };
};

const configAtom = atom<UserState>({
  address: null,
  balance: BigInt(0),
  name: null,
});

export default function useUser() {
  return useAtom(configAtom);
}
