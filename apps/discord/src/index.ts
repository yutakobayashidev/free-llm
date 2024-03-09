import chatCommand from "@/interactions/applicationCommands/chat";
import { verifyDiscordInteraction } from "@/middleware/verifyDiscordInteraction";
import { InteractionType } from "discord-interactions";
import { Hono } from "hono";
import { HonoConfig } from "./config";
import { handleApplicationCommands } from "./interactions/handleApplicationCommands";
import { errorResponse } from "./responses/errorResponse";

const app = new Hono<HonoConfig>();

app.post("/interaction", verifyDiscordInteraction, async (c) => {
  const body = await c.req.json();

  try {
    switch (body.type) {
      case InteractionType.APPLICATION_COMMAND:
        return c.json(
          await handleApplicationCommands({
            intentObj: body,
            commands: [chatCommand(c.get("internal"))],
          }),
        );
      default:
        throw new Error("Invalid interaction");
    }
  } catch (e) {
    console.error(e);
    return c.json(errorResponse(e instanceof Error ? e.message : "Unknown error"));
  }
});

export default app;
