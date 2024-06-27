import { atom, useAtom } from "jotai";
import { APP } from "../constants";

export type NFTContractState = {
  url: string | null;
};

const configAtom = atom<NFTContractState>({
  url: APP.deeplink,
});

export default function useApp() {
  return useAtom(configAtom);
}
