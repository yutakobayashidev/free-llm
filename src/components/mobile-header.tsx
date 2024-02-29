import { Chat } from "@/types";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { Button } from "./ui/button";

export function MobileHeader({ chats }: { chats?: Chat[] }) {
  const router = useRouter();

  return (
    <header className="md:hidden px-4 sticky top-0 z-10 flex min-h-[40px] items-center justify-between border-b">
      <MobileNav chats={chats} />
      <Button
        variant="ghost"
        onClick={() => {
          router.refresh();
          router.push("/");
        }}
        className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
      >
        <SquarePen />
      </Button>
    </header>
  );
}
