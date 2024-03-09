import { OpenAI } from "openai";
import { ExecutionContext, SlackApp, SlackEdgeAppEnv, SlackRequestWithChannelId, isPostedMessageEvent } from "slack-cloudflare-workers";

export default {
  async fetch(request: Request, env: SlackEdgeAppEnv & { OPENAI_API_KEY: string }, ctx: ExecutionContext): Promise<Response> {
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const app = new SlackApp({ env });

    app.event("app_mention", async ({ context, payload }) => {
      const threadTs = payload.ts;
      const threadMessages = await context.client.conversations.replies({
        channel: context.channelId,
        ts: threadTs,
      });

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = (threadMessages.messages ?? []).map((message) => ({
        role: message.user === payload.user ? "user" : "assistant",
        content: message.text as string,
      }));

      const result = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        messages: messages,
      });

      await context.client.chat.postMessage({
        channel: context.channelId,
        thread_ts: threadTs,
        text: result.choices[0].message.content ?? "Sorry, I don't understand.",
      });
    });

    app.event("message", async ({ context, payload }) => {
      if (!(isPostedMessageEvent(payload) && payload.thread_ts)) {
        return;
      }
      const threadTs = payload.thread_ts;
      const threadMessages = await context.client.conversations.replies({
        channel: context.channelId,
        ts: threadTs,
      });

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = (threadMessages.messages ?? []).map((message) => ({
        role: message.user === payload.user ? "user" : "assistant",
        content: message.text as string,
      }));

      const result = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
        messages: messages,
      });

      await context.client.chat.postMessage({
        channel: context.channelId,
        thread_ts: threadTs,
        text: result.choices[0].message.content ?? "Sorry, I don't understand.",
      });
    });

    return await app.run(request, ctx);
  },
};
