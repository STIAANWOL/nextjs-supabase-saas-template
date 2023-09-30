"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export const useGoogleLogin = async (router: AppRouterInstance) => {
  const supabase = createClientComponentClient();

  const hashParams = new URLSearchParams(window.location?.hash?.substring(1));

  if (!!hashParams?.size) {
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");
    const parts = access_token?.split(".");

    if (parts?.length === 3) {
      const payloadBase64 = parts[1];
      const decodedPayload = Buffer.from(payloadBase64, "base64").toString(
        "utf-8"
      );
      const parsedPayload = JSON.parse(decodedPayload);

      const { data: userWithEmail } = await supabase
        .from("users")
        .select("email")
        .eq("email", parsedPayload.email)
        .single();

      if (!userWithEmail) {
        await supabase.from("users").insert({
          id: parsedPayload.sub,
          email: parsedPayload.email,
        });
      }
    }

    if (access_token && refresh_token) {
      await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      router.push("/dashboard");
    }
  } else {
    router.push("/sign-in");
  }
};
