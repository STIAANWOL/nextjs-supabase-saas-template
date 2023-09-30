import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formDetails = await request.json();

  const email = formDetails.email;
  const password = formDetails.password;
  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new NextResponse(JSON.stringify("Could not authenticate user"), {
      status: 400,
    });
  }

  return new NextResponse(JSON.stringify("Success!"), {
    status: 200,
  });
}
