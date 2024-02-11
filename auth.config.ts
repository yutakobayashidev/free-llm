import { db } from "@/db/client";
import { Guild } from "@/types";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/discord";

const BASE_DISCORD_URL = "https://discordapp.com";
const guildId = process.env.DISCORD_GUILD_ID;

async function isJoinGuild(accessToken: string): Promise<boolean> {
  const res = await fetch(`${BASE_DISCORD_URL}/api/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.ok) {
    const guilds: Guild[] = await res.json();

    return guilds.some((guild: Guild) => guild.id === guildId);
  }
  return false;
}

export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      // bug: https://github.com/nextauthjs/next-auth/issues/9448
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds",
    }),
  ],
  callbacks: {
    jwt: async ({ token, account, profile }) => {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.id = profile.id;
      }
      return token;
    },
    signIn: async ({ account, user, profile }) => {
      if (account == null || account.access_token == null) return false;
      return await isJoinGuild(account.access_token);
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
  pages: {
    signIn: "/login",
  },
};
