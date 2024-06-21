import { Abi, getContract } from "viem";
import { client, walletClient } from "../viem";

export const PERMIT = {
  contract: getContract({
    address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    abi: [
      {
        type: "function",
        inputs: [
          { name: "owner", internalType: "address", type: "address" },
          {
            name: "permitSingle",
            internalType: "struct IAllowanceTransfer.PermitSingle",
            type: "tuple",
            components: [
              {
                name: "details",
                internalType: "struct IAllowanceTransfer.PermitDetails",
                type: "tuple",
                components: [
                  { name: "token", internalType: "address", type: "address" },
                  { name: "amount", internalType: "uint160", type: "uint160" },
                  {
                    name: "expiration",
                    internalType: "uint48",
                    type: "uint48",
                  },
                  { name: "nonce", internalType: "uint48", type: "uint48" },
                ],
              },
              { name: "spender", internalType: "address", type: "address" },
              { name: "sigDeadline", internalType: "uint256", type: "uint256" },
            ],
          },
          { name: "signature", internalType: "bytes", type: "bytes" },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        inputs: [
          { name: "", internalType: "address", type: "address" },
          { name: "", internalType: "address", type: "address" },
          { name: "", internalType: "address", type: "address" },
        ],
        name: "allowance",
        outputs: [
          { name: "amount", internalType: "uint160", type: "uint160" },
          { name: "expiration", internalType: "uint48", type: "uint48" },
          { name: "nonce", internalType: "uint48", type: "uint48" },
        ],
        stateMutability: "view",
      },
    ] as Abi,
    client: { public: client, wallet: walletClient },
  }),
};
