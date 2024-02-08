import { auth } from "@/auth";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

export const runtime = "edge";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return new Response("ログインしてください", {
      status: 401,
    });
  }

  const { messages, system, api_key, model } = await req.json();

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
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (e) {
    return new Response(`問題が発生しました。もう一度お試しください。${api_key ? "APIキーが無効な可能性があります" : ""}`, {
      status: 500,
    });
  }
}
