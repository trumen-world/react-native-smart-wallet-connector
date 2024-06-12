import { atom, useAtom } from "jotai";

export type NFTContractState = {
  totalSupply: BigInt | null;
};

const configAtom = atom<NFTContractState>({
  totalSupply: null,
});

export default function useNFT() {
  return useAtom(configAtom);
}
