import { auth } from "@/auth";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ChatLayout from "./chat-client";
import "./globals.css";
import Toaster from "./toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chatbot | YUTA STUDIO",
  metadataBase: new URL("https://chatbot.yutakobayashi.dev"),
  description:
    "YUTA STUDIOに参加しているDiscordユーザー限定で無料で利用できるLLMサービスです。OpenAIやオープンソースモデルなどが利用できます。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const chats = await db.query.chats.findMany({
    where: eq(schema.chats.userId, session.user.id),
    orderBy: [desc(schema.chats.createdAt)],
  });

  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <ChatLayout user={session.user} chats={chats}>
            {children}
          </ChatLayout>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
