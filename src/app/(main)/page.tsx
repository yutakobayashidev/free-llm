import Chat from "@/app/(main)/chat";
import { auth } from "@/auth";
import { nanoid } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const id = nanoid();

  return <Chat id={id} session={session} />;
}
