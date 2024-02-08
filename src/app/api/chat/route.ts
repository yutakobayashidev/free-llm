import { auth } from "@/auth";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { nanoid } from "@/lib/utils";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

export const runtime = "edge";

type Message = {
  role: string;
  content: string;
};
export async function POST(req: Request) {
  const userId = (await auth())?.user?.id;

  if (!userId) {
    return new Response("ログインしてください", {
      status: 401,
    });
  }

  const json = await req.json();

  const { messages, system, api_key, model } = json;

  if (system) {
    messages.unshift({
      role: "system",
      content: system,
    });
  }

  const openai = new OpenAI({
    apiKey: api_key ? api_key : process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model,
      stream: true,
      messages,
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        const title = system ? messages[1].content.substring(0, 100) : messages[0].content.substring(0, 100);

        const id = json.id ?? nanoid();

        const createdAt = Date.now();

        await db.insert(schema.chats).values({
          id,
          title,
          userId,
          createdAt: new Date(createdAt),
          publishStatus: "private",
        });

        await db.insert(schema.messages).values([
          ...messages.map((message: Message) => ({
            id: nanoid(),
            chatId: id,
            content: message.content,
            role: message.role,
          })),
          {
            id: nanoid(),
            chatId: id,
            content: completion,
            role: "assistant",
          },
        ]);
      },
    });
    return new StreamingTextResponse(stream);
  } catch (e) {
    return new Response(`問題が発生しました。もう一度お試しください。${api_key ? "APIキーが無効な可能性があります" : ""}`, {
      status: 500,
    });
  }
}
