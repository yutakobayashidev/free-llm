# free-llm

これは、YUTA STUDIO (Discordサーバー)に参加しているDiscordユーザー限定で無料で利用できるLLMサービスです。金銭的な理由、または他の制約で高度な言語モデルを使用できない場合などの機会損失を防ぐために作られました。 OpenAIやオープンソースモデルなどが利用できます。

また、声入力やふりがななどのアクセシビリティ機能も搭載しています。

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

3. 依存関係のインストールと開発サーバーの起動

パッケージマネージャーには[Bun](https://bun.sh)を使っています。もしインストールしていない場合は行ってください。

```bash
cd chatbot-ui
bun i
bun dev
```

4. デプロイ

VercelやNetlifyなどにデプロイすることをおすすめします。基本無償で使用できます。

https://vercel.com/docs/deployments/overview

## 貢献・要望

プルリクエストを歓迎しています。また、要望だけでもIssueを作成していただければできる限り対応します。

## ライセンス

MIT