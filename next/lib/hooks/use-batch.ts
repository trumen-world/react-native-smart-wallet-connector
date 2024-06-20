import { atom, useAtom } from "jotai";
import { Abi, AbiItem, AbiItemArgs, Address, Hex } from "viem";

export type Transaction = {
  address: `0x${string}`;
  abi: [AbiItem];
  functionName: string;
  args: string[];
};
export type BatchState = {
  transactions: Transaction[] | null;
  signature?: {
    hex: Hex | null;
    valid: boolean | null;
  };
};

const configAtom = atom<BatchState>({
  transactions: [
    {
      address: "0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
      abi: [
        {
          name: "safeMint",
          type: "function",
          stateMutability: "view",
          inputs: [
            {
              type: "address",
              name: "recipient",
            },
          ],
          outputs: [],
        },
      ],
      functionName: "safeMint",
      args: ["0x0209080b11EAf27CcbA002A30499Cc01DE69D76A"],
    },
    {
      address: "0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
      abi: [
        {
          name: "safeMint",
          type: "function",
          stateMutability: "view",
          inputs: [
            {
              type: "address",
              name: "recipient",
            },
          ],
          outputs: [],
        },
      ],
      functionName: "safeMint",
      args: ["0x0209080b11EAf27CcbA002A30499Cc01DE69D76A"],
    },
  ],
});

export default function useBatch() {
  return useAtom(configAtom);
}
