import Batcher from "@/components/Batcher";
import Page from "@/components/Page";
import TxTable from "@/components/TxTable";

export default async function Batch() {
  return (
    <Page>
      <div className="flex flex-col min-h-screen w-full gap-8 px-8 items-center pb-32">
        <Batcher />
        <TxTable />
      </div>
    </Page>
  );
}
