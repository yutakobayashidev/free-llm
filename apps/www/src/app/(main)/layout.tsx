import { auth } from "@/auth";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import ChatLayout from "./chat-client";

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="flex min-h-screen">
        <ChatLayout>{children}</ChatLayout>
      </div>
    );
  }

  const chats = await db.query.chats.findMany({
    where: eq(schema.chats.userId, session.user.id),
    orderBy: [desc(schema.chats.createdAt)],
  });

  return (
    <ChatLayout user={session.user} chats={chats}>
      {children}
    </ChatLayout>
  );
}
