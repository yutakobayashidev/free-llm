import { auth } from "@/auth";
import ChatMessage from "@/components/message";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { formatDate } from "@/lib/helpers";
import { Message } from "ai";
import { and, eq, or } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = await auth();

  const chat = await db.query.chats.findFirst({
    where: and(eq(schema.chats.id, params.id), or(eq(schema.chats.publishStatus, "public"), eq(schema.chats.publishStatus, "guild"))),
    with: {
      user: true,
      messages: {
        columns: {
          content: true,
          role: true,
          id: true,
        },
      },
    },
  });

  if (chat?.publishStatus === "guild" && !session?.user) {
    redirect(`/login?next=/hub/${params.id}`);
  }

  if (!chat) {
    return notFound();
  }

  return (
    <div>
      <div className="bg-slate-50">
        <div className="main-content w-full overflow-y-auto py-9 px-10">
          <h1 className="text-3xl mb-5 font-bold">{chat?.title}</h1>
          <div className="text-sm flex items-center text-muted-foreground">
            <img className="h-6 w-6 mr-2 rounded-sm" alt={chat.user.name ?? ""} src={chat.user.image ?? ""} />
            {formatDate(chat.createdAt)} · {chat.messages.length}件のメッセージ
          </div>
        </div>
      </div>
      <div className="space-y-4 px-10 py-10">
        {chat.messages.map((message, i) => (
          <ChatMessage key={message.id} message={message as Message} />
        ))}
      </div>
    </div>
  );
}
