import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import TopBar from "@/components/TopBar";

type DashboardProps = {
  children: React.ReactNode;
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: DashboardProps) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex w-full h-full">
      <Sidebar />

      <div className="flex flex-col w-full">
        <TopBar user={user} />
        <div className="py-3 px-4 h-full">{children}</div>
      </div>
    </div>
  );
}
