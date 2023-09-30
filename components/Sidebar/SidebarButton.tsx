"use client";

import { ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

type SidebarButtonProps = {
  buttonLabel: string;
  href: string;
  icon: ReactElement;
  linkClassName?: string;
};

export default function SidebarButton({
  buttonLabel,
  href,
  icon,
  linkClassName,
}: SidebarButtonProps) {
  const pathname = usePathname();

  const activeClass = pathname === href ? "text-muted-foreground" : "";

  return (
    <Button variant="ghost" asChild className="text-red">
      <Link href={href} {...(linkClassName && { className: linkClassName })}>
        <div className="md:pr-4">{icon}</div>
        <span className={`${activeClass} mr-auto md:block hidden`}>
          {buttonLabel}
        </span>
      </Link>
    </Button>
  );
}
