import { Icons } from "@/components/icons";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { useCopyToClipboard } from "@/hooks/copy";
import { Copy } from "lucide-react";
import { Session } from "next-auth";

export default function Onboarding({ user }: { user: Session["user"] }) {
  const [copied, copyToClipboard] = useCopyToClipboard();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-3">
          <span className="mr-2">👋</span> Welcome {user?.name ?? "不明なユーザー"}!
        </CardTitle>
        <CardDescription>
          これは、YUTA
          STUDIOに参加しているDiscordユーザー限定で無料で利用できるLLMサービスです。OpenAIやオープンソースモデルなどが利用できます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <button onClick={() => copyToClipboard(siteConfig.links.invite)} className="flex items-center" type="button">
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "コピーしました" : "Discordサーバーの招待リンクをコピー"}
          </button>
          <a href={siteConfig.links.github} className="flex items-center">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHubで貢献する
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
