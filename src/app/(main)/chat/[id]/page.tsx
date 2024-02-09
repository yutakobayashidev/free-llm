import Chat from "@/app/(main)/chat";
import { auth } from "@/auth";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { Message } from "ai";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const runtime = "edge";

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const chat = await db.query.chats.findFirst({
    where: eq(schema.chats.id, params.id),
    with: {
      messages: {
        columns: {
          content: true,
          role: true,
          id: true,
        },
      },
    },
  });

  if (!chat) {
    return notFound();
  }

  if (chat?.userId !== session?.user?.id) {
    notFound();
  }

  return <Chat session={session} id={chat.id} initialMessages={chat.messages as Message[]} />;
}
