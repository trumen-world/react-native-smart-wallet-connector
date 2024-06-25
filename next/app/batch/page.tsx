import Batcher from "@/components/Batcher";
import Page from "@/components/Page";
import TxTable from "@/components/TxTable";

export default async function Batch() {
  return (
    <Page>
      <div className="flex min-h-screen w-full flex-col items-center gap-8 px-8 pb-32">
        <Batcher />
        <TxTable />
      </div>
    </Page>
  );
}
