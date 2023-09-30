import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const formDetails = await request.json();
  const email = formDetails.email;
  const password = formDetails.password;
  const supabase = createRouteHandlerClient({ cookies });

  const { data: userWithEmail } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  if (userWithEmail) {
    return new NextResponse(
      JSON.stringify("Account with email already exists"),
      {
        status: 409,
      }
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
    },
  });

  if (error) {
    return new NextResponse(JSON.stringify("Could not create account"), {
      status: error.status,
    });
  }

  const { error: insertError } = await supabase.from("users").insert({
    id: data?.user?.id,
    email: data?.user?.email,
  });

  if (insertError) {
    throw insertError;
  }

  return new NextResponse(
    JSON.stringify("Confirm your email to continue the sign in process"),
    {
      status: 200,
    }
  );
}
