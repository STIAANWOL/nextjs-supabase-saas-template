import { User } from "@supabase/auth-helpers-nextjs";
import LogoutButton from "@/components/LogoutButton";
import { ModeToggle } from "./ModeToggle";

type TopBarProps = {
  user: User;
};

export default function TopBar({ user }: TopBarProps) {
  return (
    <nav className="w-full flex justify-center border-b">
      <div className="w-full flex justify-between items-center p-3 text-sm text-foreground">
        <div />
        <div>
          <div className="flex items-center gap-x-4">
            <ModeToggle />
            Hey, {user.email}!
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
