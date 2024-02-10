"use client";

import { updatePublishStatus } from "@/app/actions";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Chat } from "@/types";
import { PublishStatus } from "@/types";
import { GalleryThumbnails, Globe2, Lock, LogOut, type LucideIcon, MessageSquare, Plus, Settings, Share, UsersRound } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import APIDialog from "./api-key";
import SystemPrompt from "./system-prompt";

export default function ChatLayout({ chats, user, children }: { chats: Chat[]; user: Session["user"]; children: React.ReactNode }) {
  const [openSystemModal, setSystemModal] = useState(false);

  const router = useRouter();
  const path = usePathname();

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
      <ResizablePanelGroup className="flex h-full" direction="horizontal">
        <ResizablePanel
          className="bg-[#F9F9F9] min-h-screen"
          defaultSize={20}
          collapsedSize={4}
          collapsible={true}
          minSize={15}
          maxSize={20}
        >
          <div className="px-4 py-6 flex flex-col gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center">
                  <img
                    className="w-10 mr-3 rounded-sm border h-10"
                    alt={user?.name ?? "不明なユーザー"}
                    src={user?.image ?? "https://via.placeholder.com/150"}
                  />
                  <p className="font-medium">{user?.name ?? "不明なユーザー"}</p>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSystemModal(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  システムプロンプトを設定
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <nav className="grid pb-3 gap-1 px-4">
            {links.map((link, index) => (
              <>
                {link.type === "button" ? (
                  <button
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
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
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
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
              </>
            ))}
          </nav>
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
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="min-h-screen" defaultSize={80}>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
      <APIDialog />
      <SystemPrompt openSystemModal={openSystemModal} setOpenSystemModal={setSystemModal} />
    </>
  );
}
