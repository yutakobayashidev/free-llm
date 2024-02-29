type SiteConfig = {
  name: string;
  url: string;
  description: string;
  serverIconUrl: string;
  links: {
    github: string;
    invite?: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "YUTA SDTUIO",
  url: "https://chatbot.yutakobayashi.dev/",
  description:
    "YUTA STUDIOに参加しているDiscordユーザー限定で無料で利用できるLLMサービスです。OpenAIやオープンソースモデルなどが利用できます。",
  serverIconUrl: "https://github.com/yutakobayashidev.png",
  links: {
    github: "https://github.com/yutakobayashidev/free-llm",
    invite: "https://discord.gg/N9qGDX7k9U",
  },
};
