import { auth } from "@/auth";
import { findProviderByName } from "@/config/models";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { nanoid } from "@/lib/utils";
import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, OpenAIStream, StreamingTextResponse } from "ai";
import { experimental_buildOpenAssistantPrompt } from "ai/prompts";
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
  const userId = (await auth())?.user?.id;

  if (!userId) {
    return new Response("ログインしてください", {
      status: 401,
    });
  }

  const json = await req.json();

  const { messages, system, api_key, model } = json;

  const modelProvider = findProviderByName(model);

  if (api_key) {
    openai.apiKey = api_key;
  }

  if (system) {
    messages.unshift({
      role: "system",
      content: system,
    });
  }

  const title = system ? messages[1].content.substring(0, 100) : messages[0].content.substring(0, 100);
  const id = json.id ?? nanoid();

  await db
    .insert(schema.chats)
    .values({
      id,
      title,
      userId,
      createdAt: new Date(Date.now()),
      publishStatus: "guild",
    })
    .onConflictDoNothing({ target: schema.messages.id });

  const lastMessage = messages[messages.length - 1];

  try {
    if (findProviderByName(model) === "openai") {
      const response = await openai.chat.completions.create({
        model,
        stream: true,
        messages,
      });

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
            modelId: model,
            modelProvider,
            content: completion,
            role: "assistant",
          });
        },
      });
      return new StreamingTextResponse(stream);
    }

    if (findProviderByName(model) === "huggingface") {
      const response = Hf.textGenerationStream({
        model,
        inputs: experimental_buildOpenAssistantPrompt(messages),
        parameters: {
          max_new_tokens: 200,
          // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
          typical_p: 0.2,
          repetition_penalty: 1,
          truncate: 1000,
          return_full_text: false,
        },
      });

      const stream = HuggingFaceStream(response, {
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
            modelId: model,
            modelProvider,
            content: completion,
            role: "assistant",
          });
        },
      });

      return new StreamingTextResponse(stream);
    }

    return new Response("モデルが見つかりません", {
      status: 404,
    });
  } catch (e) {
    return new Response(`問題が発生しました。もう一度お試しください。${api_key ? "APIキーが無効な可能性があります" : ""}`, {
      status: 500,
    });
  }
}
