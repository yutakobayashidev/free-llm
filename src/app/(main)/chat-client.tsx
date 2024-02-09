"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Chat } from "@/types";
import { Settings } from "lucide-react";
import { LogOut } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import APIDialog from "./api-key";
import SystemPrompt from "./system-prompt";

export default function ChatLayout({ chats, user, children }: { chats: Chat[]; user: Session["user"]; children: React.ReactNode }) {
  const [openSystemModal, setSystemModal] = useState(false);

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
          <div className="px-4">
            <h2 className="mb-3 font-semibold">メッセージ履歴</h2>
            <div className="space-y-4">
              {chats.map((chat) => (
                <Link href={`/chat/${chat.id}`} className="block" key={chat.id}>
                  <h2 className="text-sm line-clamp-1 flex items-start font-medium">
                    <MessageSquare className="mr-2" />
                    {chat.title}
                  </h2>
                </Link>
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
