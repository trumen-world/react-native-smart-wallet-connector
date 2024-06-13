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
  if (!searchParams.message) {
    return <AppReturn message="No Message Param Provided From React Native" />;
  }
  const ADDRESS_PARAM = searchParams.address.toString();
  console.log("Address Param: ", ADDRESS_PARAM);
  const MESSAGE_PARAM = searchParams.message.toString();
  console.log("Message Param: ", MESSAGE_PARAM);

  return (
    <Page>
      <p className="p-4 flex flex-col w-96 text-center">
        <span className="text-blue-500 font-bold">{`SIGN`}</span>
      </p>

      <Signer
        accountAddress={ADDRESS_PARAM}
        // messageToSign={MESSAGE_PARAM}
      />

      {ADDRESS_PARAM ? <UserAddress /> : <></>}
    </Page>
  );
}