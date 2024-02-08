import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Toaster from "./toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chatbot | YUTA STUDIO",
  metadataBase: new URL("https://chatbot.yutakobayashi.dev"),
  description:
    "YUTA STUDIOに参加しているDiscordユーザー限定で無料で利用できるLLMサービスです。OpenAIやオープンソースモデルなどが利用できます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
