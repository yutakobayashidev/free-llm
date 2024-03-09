import OpenAI from "openai";

export type InternalContext = {
  openai: OpenAI;
};

export interface HonoConfig {
  Bindings: {
    OPENAI_API_KEY: string;
  };
  Variables: {
    openai: OpenAI;
    internal: InternalContext;
  };
}
