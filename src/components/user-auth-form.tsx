"use client";

import Discord from "@/assets/logos/discord-mark-white.svg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-2">
        <Button onClick={() => signIn("discord")} className="bg-[#5865F2] hover:bg-[#5865F2]" type="button">
          <Discord className="mr-2 h-4 w-4" /> Continue with Disocrd
        </Button>
      </div>
    </div>
  );
}
