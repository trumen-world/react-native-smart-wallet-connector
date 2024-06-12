"use client";
import Page from "@/components/Page";
import useUser, { type UserState } from "@/lib/hooks/use-user";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";
import { base } from "viem/chains";
import { createConfig, http } from "wagmi";
import { useAccount, useConnect } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

export default function Create() {
  const [user, setUser] = useUser();
  const { connect, status, error } = useConnect();
  const config = createConfig({
    chains: [base],
    connectors: [
      coinbaseWallet({
        appName: "Trumen World",
        preference: "smartWalletOnly",
      }),
    ],
    transports: { [base.id]: http() },
  });
  const account = useAccount({ config });

  useEffect(() => {
    connect({
      chainId: 8453,
      connector: coinbaseWallet({
        appName: "Coinbase Smart Wallet w/ React Native",
        preference: "smartWalletOnly",
      }),
    });
    setUser((prevState: UserState) => ({ ...prevState, account }));
  }, []);

  return (
    <Page>
      <p className="p-4 flex flex-col w-72 text-center">
        <span className="text-blue-500 font-bold">CREATE</span>
        <span>
          Go to{" "}
          <Link
            href={"https://keys.coinbase.com"}
            className="italic text-sky-500 dark:text-sky-300"
          >
            keys.coinbase.com
          </Link>
        </span>
      </p>
      <p className="p-4 flex flex-col w-96 text-center">
        Connection Status:
        <span
          className={cn(
            status === "success" && "dark:text-lime-500 text-lime-700",
          )}
        >
          {status}
        </span>
      </p>
      {user.account ? (
        <p className="p-4 flex flex-col w-64 items-center text-center sm:text-base md:text-lg lg:text-xl text-indigo-500">
          Account:
          <span className="text-indigo-800 dark:text-indigo-100 text-xs tracking-wide sm:text-sm md:text-base lg:text-lg">
            {user.account.address}
          </span>
        </p>
      ) : (
        <></>
      )}

      {error ? (
        <p className="p-4 flex flex-col text-red-500 w-96 text-center">{`${error}`}</p>
      ) : (
        <></>
      )}
    </Page>
  );
}
