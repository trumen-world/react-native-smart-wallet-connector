import { createPublicClient, createWalletClient, custom, http } from "viem";
import { base } from "viem/chains";

// Set up public (READ) client with desired chain & transport.
export const client = createPublicClient({
  chain: base,
  transport: http(),
}); // --> Usage: const blockNumber = await client.getBlockNumber()

// Set up wallet (WRITE) client with desired chain & transport.
export const walletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: base,
        transport: custom(window.ethereum),
      })
    : null;
// --> Usage: const blockNumber = await walletClient.write({
//   account,
//   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
//   abi: wagmiAbi,
//   functionName: 'mint',
// })
