import Chat from "@/app/chat";
import { auth } from "@/auth";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { nanoid } from "@/lib/utils";
import { eq, or } from "drizzle-orm";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const id = nanoid();

  await db.query.chats.findMany({
    where: or(eq(schema.chats.publishStatus, "guild"), eq(schema.chats.publishStatus, "public")),
    with: {
      user: true,
      messages: true,
    },
  });

  const chats = await db.query.chats.findMany({
    where: eq(schema.chats.userId, session.user.id),
  });

  return <Chat id={id} chats={chats} session={session} />;
}
