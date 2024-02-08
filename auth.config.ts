import { Guild } from "@/types";
import type { NextAuthConfig } from "next-auth";
import { type DefaultSession } from "next-auth";
import Discord from "next-auth/providers/discord";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

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
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      // bug: https://github.com/nextauthjs/next-auth/issues/9448
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds",
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken as string;
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
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
  },
  pages: {
    signIn: "/login",
  },
};
