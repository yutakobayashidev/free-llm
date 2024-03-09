import { InternalContext } from "@/config";
import { CHAT_COMMAND_NAME } from "@/constants";
import { buildChatCommandResponse } from "@/responses/chatCommandResponse";

const handler = async (ctx: InternalContext) => {
  const res = await ctx.openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "user",
        content: "What's the meaning of life?",
      },
    ],
  });

  return buildChatCommandResponse({ text: res.choices[0].message.content });
};

export default function chatCommand(ctx: InternalContext) {
  return {
    commandName: CHAT_COMMAND_NAME,
    handler: () => handler(ctx),
  };
}
