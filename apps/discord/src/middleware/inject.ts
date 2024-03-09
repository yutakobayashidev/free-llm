import { HonoConfig } from "@/config";
import { createMiddleware } from "hono/factory";
import OpenAI from "openai";

export const inject = createMiddleware<HonoConfig>(async (c, next) => {
  if (!c.get("openai")) {
    const client = new OpenAI({ apiKey: c.env.OPENAI_API_KEY });
    c.set("openai", client);
  }

  if (!c.get("internal")) {
    const internal = {
      openai: c.get("openai"),
    };
    c.set("internal", internal);
  }

  await next();
});
