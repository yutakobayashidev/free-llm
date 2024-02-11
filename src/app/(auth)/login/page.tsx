import { UserAuthForm } from "@/components/user-auth-form";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export default function Page() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="w-full mx-auto flex justify-center">
            <img alt={siteConfig.name} src={siteConfig.serverIconUrl} className="h-[40px] border w-[40px] rounded mx-auto" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">ログインして続行</h1>
          <p className="text-sm text-muted-foreground">Discordでログインまたはサインアップ</p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          このサービスは{siteConfig.name}のDiscordサーバー参加者に限定されます{" "}
        </p>
      </div>
    </div>
  );
}
