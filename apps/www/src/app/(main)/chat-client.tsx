"use client";

import { updatePublishStatus } from "@/app/actions";
import Discord from "@/assets/logos/discord-mark-white.svg";
import { MobileHeader } from "@/components/mobile-header";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Chat } from "@/types";
import { PublishStatus } from "@/types";
import { GalleryThumbnails, Globe2, Lock, LogOut, type LucideIcon, MessageSquare, Plus, Settings, Share, UsersRound } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import APIDialog from "./api-key";
import SystemPrompt from "./system-prompt";

export default function ChatLayout({ chats, user, children }: { chats?: Chat[]; user?: Session["user"]; children: React.ReactNode }) {
  const [openSystemModal, setSystemModal] = useState(false);

  const router = useRouter();
  let path = usePathname();

  if (path.includes("/hub/")) {
    path = "/hub";
  }

  const publishStatus = async (id: string, status: PublishStatus) => {
    await updatePublishStatus(id, status);

    router.refresh();
  };

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
    <>
      <MobileHeader chats={chats} />
      <div className="relative z-0 flex h-full w-full overflow-hidden">
        <div className="bg-[#F9F9F9] w-[260px] overflow-x-hidden force-scrollbar overflow-y-auto md:overflow-y-hidden min-h-screen hidden md:block">
          <div className="px-4 py-6 flex flex-col gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user?.image && user.name ? (
                  <button type="button" className="flex items-center">
                    <img className="w-10 mr-3 rounded-sm border h-10" alt={user.name} src={user.image} />
                    <p className="font-medium">{user.name}</p>
                  </button>
                ) : (
                  <Button onClick={() => signIn("discord")} className="bg-[#5865F2] hover:bg-[#5865F2]" type="button">
                    <Discord className="mr-2 h-4 w-4" /> Discordでログイン
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSystemModal(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  システムプロンプトを設定
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    signOut({
                      callbackUrl: "/login",
                    })
                  }
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <nav className="grid pb-3 gap-1 px-4">
            {links.map((link) => (
              <Fragment key={link.href}>
                {link.type === "button" ? (
                  <button
                    type="button"
                    onClick={link.onClick}
                    className={cn(
                      buttonVariants({ variant: link.href === path ? "default" : "ghost", size: "sm" }),
                      link.href === path && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                      "justify-start",
                    )}
                  >
                    <link.icon className="mr-2 h-3 w-3" />
                    {link.title}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      buttonVariants({ variant: link.href === path ? "default" : "ghost", size: "sm" }),
                      link.href === path && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                      "justify-start",
                    )}
                  >
                    <link.icon className="mr-2 h-3 w-3" />
                    {link.title}
                  </Link>
                )}
              </Fragment>
            ))}
          </nav>
          {chats && (
            <div className="px-4">
              <h2 className="mb-3 font-semibold">メッセージ履歴</h2>
              <div className="space-y-4">
                {chats.map((chat) => (
                  <div key={chat.id} className="relative h-8">
                    <div className="absolute left-2 top-1 flex h-6 w-6 items-center justify-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                    </div>
                    <Link
                      href={`/chat/${chat.id}`}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "group w-full px-8 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10",
                        path === `/chat/${chat.id}` && "bg-zinc-200 pr-16 font-semibold dark:bg-zinc-800",
                      )}
                    >
                      <div className="text-sm relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all line-clamp-1 flex items-start font-medium">
                        <span className="whitespace-nowrap">{chat.title}</span>
                      </div>
                    </Link>
                    {path === `/chat/${chat.id}` && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="absolute right-2 top-1">
                            <div className="space-x-1">
                              <Button variant="ghost" className="size-6 p-0 hover:bg-background">
                                <Share className="h-4 w-4" />
                                <span className="sr-only">Share</span>
                              </Button>
                            </div>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none text-muted-foreground">このチャットが見れるのは...</h4>
                            </div>
                            <RadioGroup
                              onValueChange={(value) => {
                                publishStatus(chat.id, value as PublishStatus);
                              }}
                              defaultValue={chat.publishStatus}
                              className="grid gap-4"
                            >
                              <div>
                                <RadioGroupItem value="private" id="private" className="peer sr-only" />
                                <Label
                                  htmlFor="private"
                                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <Lock className="h-6 w-6" />
                                  自分だけ
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="guild" id="guild" className="peer sr-only" />
                                <Label
                                  htmlFor="guild"
                                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <UsersRound className="h-6 w-6" />
                                  サーバーメンバー
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="public" id="public" className="peer sr-only" />
                                <Label
                                  htmlFor="public"
                                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <Globe2 className="h-6 w-6" />
                                  公開
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">{children}</div>
      </div>
      <APIDialog />
      <SystemPrompt openSystemModal={openSystemModal} setOpenSystemModal={setSystemModal} />
    </>
  );
}
