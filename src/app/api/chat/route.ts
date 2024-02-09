import { auth } from "@/auth";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { nanoid } from "@/lib/utils";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const userId = (await auth())?.user?.id;

  if (!userId) {
    return new Response("ログインしてください", {
      status: 401,
    });
  }

  const json = await req.json();

  const { messages, system, api_key, model } = json;

  if (api_key) {
    openai.apiKey = api_key;
  }

  if (system) {
    messages.unshift({
      role: "system",
      content: system,
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model,
      stream: true,
      messages,
    });

    const title = system ? messages[1].content.substring(0, 100) : messages[0].content.substring(0, 100);

    const id = json.id ?? nanoid();

    await db
      .insert(schema.chats)
      .values({
        id,
        title,
        userId,
        createdAt: new Date(Date.now()),
        publishStatus: "private",
      })
      .onConflictDoNothing({ target: schema.messages.id });

    const lastMessage = messages[messages.length - 1];

    const stream = OpenAIStream(response, {
      async onStart() {
        await db.insert(schema.messages).values({
          id: nanoid(),
          chatId: id,
          content: lastMessage.content,
          role: "user",
        });
      },
      async onCompletion(completion) {
        await db.insert(schema.messages).values({
          id: nanoid(),
          chatId: id,
          content: completion,
          role: "assistant",
        });
      },
    });
    return new StreamingTextResponse(stream);
  } catch (e) {
    return new Response(`問題が発生しました。もう一度お試しください。${api_key ? "APIキーが無効な可能性があります" : ""}`, {
      status: 500,
    });
  }
}
