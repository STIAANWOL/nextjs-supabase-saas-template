import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const supabase_response = await supabaseAdmin.auth.admin.deleteUser(
    user?.id || ""
  );

  if (supabase_response?.error) {
    return new NextResponse(JSON.stringify("Failed to delete account"), {
      status: supabase_response?.error?.status,
    });
  }

  await supabase.auth.signOut();

  return new NextResponse(JSON.stringify("OK!"), {
    status: 200,
  });
}
