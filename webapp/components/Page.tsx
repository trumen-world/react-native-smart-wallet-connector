import { ReactNode } from "react";

const Page = ({ children }: { children: ReactNode }) => {
  return (
    <section className="flex flex-col items-center w-full h-full">
      {children}
    </section>
  );
};

export default Page;
