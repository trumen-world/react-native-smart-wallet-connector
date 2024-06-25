import { atom, useAtom } from "jotai";

export type NFTContractState = {
  url: string | null;
};

const configAtom = atom<NFTContractState>({
  url: "RNCBSmartWallet://",
});

export default function useApp() {
  return useAtom(configAtom);
}
