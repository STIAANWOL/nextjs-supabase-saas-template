import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Index() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <nav className="w-full flex justify-center h-16">
        <div className="w-full flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <div className="flex gap-x-4">
            <ModeToggle />
            <Button variant="outline" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
