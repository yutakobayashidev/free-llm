import Chat from "@/app/chat";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return <Chat session={session} />;
}
