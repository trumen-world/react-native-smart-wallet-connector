import { walletClient } from "@/lib/chain/viem";
import { domain, types } from "@/lib/constants";
import { NextRequest } from "next/server";
import { Address } from "viem";

export async function POST(
  request: NextRequest,
  { params }: { params: { account: string } },
) {
  if (!params.account) throw new Error("No account parameter!");

  const signature = await walletClient.signTypedData({
    account: params.account as Address,
    domain,
    types,
    primaryType: "Mail",
    message: {
      from: {
        name: "Cow",
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
      contents: "Hello, Bob!",
    },
  });

  console.log("signTypedData server sig", signature);
}
