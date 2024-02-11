# free-llm

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyutakobayashidev%2Ffree-llm&env=OPENAI_API_KEY,AUTH_SECRET,DISCORD_CLIENT_ID,DISCORD_CLIENT_SECRET,DISCORD_GUILD_ID,POSTGRES_URL&envDescription=Discord%E3%81%AEOauth%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E3%82%84Neon%E3%81%AEPostgress%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%82%92%E8%A8%98%E8%BC%89%E3%81%97%E3%81%BE%E3%81%99%E3%80%82&project-name=free-llm&repository-name=free-llm)

これは、[YUTA STUDIO (Discordサーバー)](https://discord.gg/N9qGDX7k9U)に参加しているDiscordユーザー限定で無料で利用できるLLMサービスです。金銭的な理由、または他の制約で高度な言語モデルを使用できない場合などの機会損失を防ぐために作られました。 OpenAIやオープンソースモデルなどが利用できます。

> [!NOTE]
> これは[voice-gpt](https://github.com/yutakobayashidev/voice-gpt)の後継プロジェクトです。

## 目的

多くの人がGPT-4モデルやその他の先進的なLLMの価値を十分に理解できていないことがあります。金銭的な問題やその他の事情でこれらのモデルにアクセスできない人もいます。このプロジェクトは、小規模コミュニティが小規模コミュニティのためにLLMアクセスを提供し、予算が限られている状況でも運用できるようにするために設計されました。この仕組みとコードを共有することで、より多くの人がこの取り組みに参加できるようにします。

## なぜ認証を設けているのか？

似たような前例の取り組みでは、APIエンドポイントの攻撃で予算が使い切られてしまう事例がありました。そこで、一定のエンドポイントのRedisキャッシュやアカウントの認証が必要と考えています。

また認証プロバイダーにDiscordを使用しているのはコミュニケーションと拡張性を円滑にするためです。

## 使用方法

[私のDiscordサーバー](https://discord.gg/N9qGDX7k9U)に参加してページからDiscordにログインすると使用できます。

しかし、GPT4などの高度なモデルを使用できない環境の方を目的に作成していますので、金銭的に余裕がある方はこのプロジェクトをクローンやフォークして似たような取り組みをしていただけると嬉しいです。

## 技術スタック

- Next.js
- shadcn/ui
- next-auth
- Neon
- OpenAI API
- Vercel AI SDK
- Langchain
- Hugging face inference API

## 開発環境

1. GitHubからクローン

コマンドラインでGitHubからローカルにプロジェクトをダウンロードします。

```bash
git clone https://github.com/yutakobayashidev/free-llm.git
```

2. 環境変数をセットする

APIキーやデータベースに接続するために環境変数をセットします。.env.exampleファイルをコピーして環境変数を埋めていきます。

```bash
cp .env.example .env
```

- OPENAI_API_KEY: https://platform.openai.com/account/api-keys
- HUGGINGFACE_API_KEY: https://huggingface.co/settings/tokens
- DISCORD_CLIENT_ID、DISCORD_CLIENT_SECRET: https://discord.com/developers/docs/topics/oauth2
- DISCORD_GUILD_ID: Discordで開発者モードをONにしてサーバーアイコンを右クリックしてコピーします
- POSTGRES_URL: https://neon.tech
- AUTH_SECRET: openssl rand -hex 32 or https://generate-secret.vercel.app/32
- AUTH_URL: Vercelにデプロイした場合は扶養

次に、Neonに接続したらマイグレーションを実行します。

```bash
pnpm db:push
```

3. 依存関係のインストールと開発サーバーの起動

パッケージマネージャーにはpnpmを使っています。もしインストールしていない場合は行ってください。

```bash
cd free-llm
pnpm i
pnpm dev
```

## デプロイ

VercelやNetlifyなどにデプロイすることをおすすめします。基本無償で使用できます。

https://vercel.com/docs/deployments/overview

## 貢献・要望

プルリクエストを歓迎しています。また、要望だけでもIssueを作成していただければできる限り対応します。

## カスタマイズ

### 特定のGoogle Workspaceのドメインのアカウントのみがログインできるようにする

認証にはAuth.jsを使っているので比較的かんたんにこのようなカスタマイズができます。auth.config.tsを少し編集します。

```ts
import { db } from "@/db/client";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account && account.provider === "google" && profile && profile.email) {
        return profile.email.endsWith("@google.com"); // ここでドメインを指定する
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
};
```

## ライセンス

MIT
