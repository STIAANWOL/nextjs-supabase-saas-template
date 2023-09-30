"use client";

import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Oauth() {
  if (typeof window === "undefined") {
    return;
  }

  const router = useRouter();

  useEffect(() => {
    useGoogleLogin(router);
  }, []);

  return <></>;
}
