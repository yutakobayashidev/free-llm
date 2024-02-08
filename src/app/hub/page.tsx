import { db } from "@/db/client";
import * as schema from "@/db/schema";
import clsx from "clsx";
import { desc, eq, or } from "drizzle-orm";
import { MessageSquare } from "lucide-react";

export default async function Page() {
  const chats = await db.query.chats.findMany({
    where: or(eq(schema.chats.publishStatus, "public"), eq(schema.chats.publishStatus, "guild")),
    orderBy: [desc(schema.chats.createdAt)],
    with: {
      user: true,
      messages: true,
    },
  });
  return (
    <div className="main-content w-full overflow-y-auto py-8 px-10">
      <h1 className="text-2xl mb-5 font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">Message Hub</h1>
      <p className="mb-5">公開・サーバーの参加者限定のチャット一覧</p>
      <div className="space-y-5">
        {chats.map((chat) => (
          <div className="flex justify-between items-center" key={chat.id}>
            <div className="gap-x-3 flex items-center">
              <img
                className="w-10 rounded-sm border h-10"
                alt={chat.user.name ?? "不明なユーザー"}
                src={chat.user.image ?? "https://via.placeholder.com/150"}
              />
              <h2 className="line-clamp-1 font-semibold flex items-start">{chat.title}</h2>
              <p className="text-sm text-gray-400">{chat.user.name}</p>
            </div>
            <div className="flex gap-x-3 items-center">
              <div className="flex text-sm items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                <p className="text-gray-500">{chat.messages.length}</p>
              </div>
              <div
                className={clsx(
                  {
                    "bg-blue-200 text-blue-500": chat.publishStatus === "guild",
                    "bg-purple-200 text-purple-500": chat.publishStatus === "public",
                    "px-2 py-1 rounded-md": true,
                  },
                  "px-2 py-1 rounded-md text-sm",
                )}
              >
                {chat.publishStatus === "guild" ? "サーバー内" : "公開"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
