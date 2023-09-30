import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const PUT = async (request: NextRequest) => {
  const changePasswordValues = await request.json();

  const supabase = createServerComponentClient({ cookies });

  const supabase_response = await supabase.rpc("change_user_password", {
    current_password: changePasswordValues?.currentPassword,
    new_password: changePasswordValues?.newPassword,
  });

  if (supabase_response?.status !== 200) {
    return new NextResponse(JSON.stringify(supabase_response?.error?.message), {
      status: supabase_response?.status,
    });
  }

  return new NextResponse(JSON.stringify("OK!"), {
    status: supabase_response?.status,
  });
};
