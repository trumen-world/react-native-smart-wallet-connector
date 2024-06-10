import { createPublicClient, createWalletClient, custom, http } from "viem";
import { mainnet } from "viem/chains";

// Set up public (READ) client with desired chain & transport.
export const client = createPublicClient({
  chain: mainnet,
  transport: http(),
}); // --> Usage: const blockNumber = await client.getBlockNumber()

// Set up wallet (WRITE) client with desired chain & transport.
export const walletClient = createWalletClient({
  chain: mainnet,
  transport:
    typeof window !== "undefined" && (window as any).ethereum
      ? custom((window as any).ethereum)
      : http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
});
// --> Usage: const blockNumber = await walletClient.write({
//   account,
//   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
//   abi: wagmiAbi,
//   functionName: 'mint',
// })
