import { atom, useAtom } from "jotai";
import { UseAccountReturnType } from "wagmi";

export enum ConnectionStatus {
  CONNECTED,
  DISCONNECTED,
}

export type UserState = {
  account: UseAccountReturnType | null;
  balance: bigint | null;
  connectionStatus: ConnectionStatus | null;
  name: string | null;
};

const configAtom = atom<UserState>({
  account: null,
  balance: BigInt(0),
  connectionStatus: null,
  name: null,
});

export default function useUser() {
  return useAtom(configAtom);
}