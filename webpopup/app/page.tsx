import AddressCard from "@/components/AddressCard";
import Page from "@/components/Page";
import UserCard from "@/components/UserCard";
import WorldCard from "@/components/WorldCard";

export default async function Home() {
  return (
    <Page>
      <div className="grid md:grid-cols-7 w-full">
        <div className="col-span-4 gap-2 w-full flex flex-col p-2">
          <UserCard />
          <WorldCard />
          <AddressCard />
        </div>
      </div>
    </Page>
  );
}
