"use client";

import { useAccount } from "wagmi";

const UserAddress = () => {
  const account = useAccount();
  return (
    <p className="p-4 flex flex-col w-64 items-center text-center sm:text-base md:text-lg lg:text-xl text-indigo-500">
      Address:
      <span className="text-indigo-800 dark:text-indigo-100 text-xs tracking-wide sm:text-sm md:text-base lg:text-lg">
        {account.address}
      </span>
    </p>
  );
};

export default UserAddress;
