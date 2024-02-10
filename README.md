# free-llm

これは、YUTA STUDIO (Discordサーバー)に参加しているDiscordユーザー限定で無料で利用できるLLMサービスです。このサービスは、金銭的な制約やその他の理由で高度な言語モデルを利用できない方に、OpenAIやオープンソースモデルなどのアクセスを提供することを目的としています。また、アクセシビリティ機能として、声入力やふりがなサポートも提供しています。

> [!NOTE]
> これは[voice-gpt](https://github.com/yutakobayashidev/voice-gpt)の後継プロジェクトです。

## 目的

多くの人がGPT-4モデルやその他の先進的なLLMの価値を十分に理解できていないことがあります。金銭的な問題やその他の事情でこれらのモデルにアクセスできない人もいます。このプロジェクトは、小規模コミュニティが小規模コミュニティのためにLLMアクセスを提供し、予算が限られている状況でも運用できるようにするために設計されました。この仕組みとコードを共有することで、より多くの人がこの取り組みに参加できるようにします。

## なぜ認証を設けているのか？

似たような前例の取り組みでは、APIエンドポイントの攻撃で予算が使い切られてしまう事例がありました。そこで、一定のエンドポイントのRedisキャッシュやアカウントの認証が必要と考えています。

また認証プロバイダーにDiscordを使用しているのはコミュニケーションと拡張性を円滑にするためです。

## 使用方法

私のDiscordサーバーに参加してページからDiscordにログインすると使用できます。

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

## セットアップ

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

4. デプロイ

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
