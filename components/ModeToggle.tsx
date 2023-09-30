"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

type ModeToggleProps = {
  className?: string;
};

export function ModeToggle({ className }: ModeToggleProps) {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      className={className}
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
      variant="outline"
      size="icon"
    >
      <Sun
        strokeWidth={1.5}
        width={20}
        height={20}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        strokeWidth={1.5}
        width={20}
        height={20}
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
