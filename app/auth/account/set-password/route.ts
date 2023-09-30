import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const PUT = async (request: NextRequest) => {
  const newPassword = await request.json();

  const supabase = createServerComponentClient({ cookies });

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return new NextResponse(JSON.stringify("Could not add password!"), {
      status: error?.status,
    });
  }

  return new NextResponse(JSON.stringify("OK!"), {
    status: 200,
  });
};
