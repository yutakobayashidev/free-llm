import Chat from "@/app/chat";
import { auth } from "@/auth";
import { nanoid } from "@/lib/utils";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const id = nanoid();

  return <Chat id={id} session={session} />;
}
