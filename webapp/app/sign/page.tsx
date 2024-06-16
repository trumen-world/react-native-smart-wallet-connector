import Page from "@/components/Page";
import Signer from "@/components/Signer";
import AppReturn from "@/components/AppReturn";
import UserAddress from "@/components/UserAddress";

export default async function Sign({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams.address) {
    return <AppReturn message="No Account Param Provided From React Native" />;
  }
  // if (!searchParams.message) {
  //   return <AppReturn message="No Message Param Provided From React Native" />;
  // }
  const ADDRESS_PARAM = searchParams.address.toString();
  console.log("Address Param: ", ADDRESS_PARAM);
  const MESSAGE_PARAM = searchParams.message?.toString();
  console.log("Message Param: ", MESSAGE_PARAM);

  return (
    <Page>
      <Signer />
      {MESSAGE_PARAM && (
        <p className="p-4 flex flex-col w-64 items-center text-center sm:text-base md:text-lg lg:text-xl text-indigo-500">
          Message:
          <span className="text-indigo-800 dark:text-indigo-100 text-xs tracking-wide sm:text-sm md:text-base lg:text-lg">
            {MESSAGE_PARAM}
          </span>
        </p>
      )}
      {ADDRESS_PARAM ? <UserAddress /> : <></>}
    </Page>
  );
}
