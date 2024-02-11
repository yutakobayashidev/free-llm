import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Toaster from "./toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `AI Chatbot | ${siteConfig.name}`,
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
};

export default async function RootLayout({
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
