import { User2, LayoutDashboard, Codesandbox } from "lucide-react";
import SidebarButton from "./SidebarButton";

export default function Sidebar() {
  return (
    <div className="flex flex-col items-center w-14 md:w-52 md:min-w-[190px] h-full text-ghost-white rounded">
      <div className="flex items-center w-full p-3">
        <div className="w-10 h-10 flex justify-center">
          <Codesandbox strokeWidth={1.5} height={40} width={40} />
        </div>
        <span className="pl-2 text-lg md:block hidden">SaaS</span>
      </div>
      <div className="flex flex-col w-full h-full p-2 border-t border-r">
        <SidebarButton
          href="/dashboard"
          icon={<LayoutDashboard strokeWidth={1.5} height={24} width={24} />}
          buttonLabel="Dashboard"
        />

        <SidebarButton
          href="/dashboard/account"
          linkClassName="flex items-center mt-auto"
          icon={<User2 strokeWidth={1.5} height={24} width={24} />}
          buttonLabel="Account"
        />
      </div>
    </div>
  );
}
