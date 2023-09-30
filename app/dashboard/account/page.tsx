import AccountDetails from "@/components/Account/AccountDetails";

export default async function Account() {
  return (
    <>
      <h1 className="text-3xl sm:text-4xl text-center">Account</h1>
      <h2 className="text-md md:text-lg pt-5 pb-10 text-center">
        Information about your account
      </h2>
      <AccountDetails />
    </>
  );
}
