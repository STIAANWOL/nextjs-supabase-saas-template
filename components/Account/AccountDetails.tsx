import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { ScrollArea } from "../ui/scroll-area";
import { cookies } from "next/headers";
import UpdatePasswordForm from "./UpdatePasswordForm";
import { Separator } from "../ui/separator";
import DeleteAccount from "./DeleteAccount";
import SetPasswordForm from "./SetPasswordForm";

export const dynamic = "force-dynamic";

export default async function AccountDetails() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: hasUserSetPassword } = await supabase.rpc(
    "has_user_set_password"
  );

  return (
    <ScrollArea className="h-[calc(100%-200px)] mb-[200px] w-full">
      <div className="w-full h-full flex justify-center">
        <div className="w-full sm:max-w-md">
          <div className="pb-3">
            <h3 className="text-md md:text-lg">Details</h3>
          </div>
          <div className="flex flex-col">
            <span>Email</span>
            <span className="text-sm">{user?.email}</span>
          </div>

          {hasUserSetPassword && (
            <>
              <div className="pb-3">
                <Separator className="mt-5 mb-2 w-full" />
                <h3 className="text-md md:text-lg">Change password</h3>
              </div>
              <UpdatePasswordForm />
            </>
          )}

          {!hasUserSetPassword && (
            <>
              <div className="pb-3">
                <Separator className="mt-5 mb-2 w-full" />
                <h3 className="text-md md:text-lg">Add password</h3>
              </div>
              <SetPasswordForm />
            </>
          )}

          <DeleteAccount />
        </div>
      </div>
    </ScrollArea>
  );
}
