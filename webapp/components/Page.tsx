import { ReactNode } from "react";

const Page = ({ children }: { children: ReactNode }) => {
  return (
    <section className="flex flex-col items-center w-full min-h-screen py-24">
      {children}
    </section>
  );
};

export default Page;
