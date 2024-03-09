import { APIInteractionResponseChannelMessageWithSource, InteractionResponseType } from "discord-api-types/v10";

export const buildChatCommandResponse = ({
  text,
}: {
  text: string | null;
}): APIInteractionResponseChannelMessageWithSource => {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: text ?? "I'm sorry, I don't understand that.",
    },
  };
};
