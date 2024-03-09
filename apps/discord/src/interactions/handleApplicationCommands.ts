import { APIBaseInteraction, InteractionType } from "discord-api-types/v10";

export type ApplicationCommandObj = APIBaseInteraction<
  InteractionType.ApplicationCommand,
  {
    name: string;
  }
>;

export const handleApplicationCommands = async ({
  intentObj,
  commands,
}: {
  intentObj: ApplicationCommandObj;
  commands: {
    commandName: string;
    handler: (args: {
      intentObj: ApplicationCommandObj;
    }) => Promise<{
      type: number;
      data: unknown;
    }>;
  }[];
}) => {
  for (const command of commands) {
    if (command.commandName === intentObj.data?.name) {
      return command.handler({
        intentObj,
      });
    }
  }

  throw new Error("Invalid interaction");
};
