import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Chat } from "@/types";
import { AlignJustify } from "lucide-react";
import { GalleryThumbnails, LucideIcon, Plus } from "lucide-react";
import Link, { LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export function MobileNav({ chats }: { chats?: Chat[] }) {
  const router = useRouter();

  let path = usePathname();

  if (path.includes("/hub/")) {
    path = "/hub";
  }

  const [open, setOpen] = useState(false);

  const links: {
    title: string;
    icon: LucideIcon;
    href: string;
    type?: "button" | "link";
    onClick?: () => void;
  }[] = [
    {
      title: "新規チャット",
      href: "/",
      icon: Plus,
      type: "button",
      onClick: () => {
        router.refresh();
        router.push("/");
      },
    },
    {
      title: "メッセージハブ",
      icon: GalleryThumbnails,
      href: "/hub",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <AlignJustify />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink onOpenChange={setOpen} className="flex items-center" href="/">
          <img alt={siteConfig.name} src={siteConfig.serverIconUrl} className="mr-2 h-4 w-4" />
          <span className="font-bold">{siteConfig.name}</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {chats?.map((item) => (
              <MobileLink key={item.id} href={`/chat/${item.id}`} onOpenChange={setOpen}>
                {item.title}
              </MobileLink>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
