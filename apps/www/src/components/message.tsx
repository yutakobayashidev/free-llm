import type { Message as MessageType } from "ai";
import { Bot } from "lucide-react";
import { UserRound } from "lucide-react";
import { Session } from "next-auth";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function Message({
  message,
  session,
  isRuby,
  ruby,
}: { message: MessageType; session?: Session; isRuby?: boolean; ruby?: string }) {
  return (
    <>
      {message.role === "assistant" ? (
        <div className="flex items-start justify-start">
          <div className="h-10 border mr-3 flex rounded justify-center items-center w-10">
            <Bot className="h-6 w-6" />
          </div>
          <Markdown
            components={{
              p({ children }) {
                return <p className="last:mb-0 first:mt-0">{children}</p>;
              },
            }}
            rehypePlugins={[rehypeRaw]}
            className="prose break-words prose-p:leading-relaxed prose-pre:p-0 flex-1"
          >
            {isRuby && ruby ? ruby : message.content}
          </Markdown>
        </div>
      ) : (
        <div className="flex items-start justify-start">
          {session?.user?.image && session.user.name ? (
            <img src={session.user.image} alt={session.user.name} className="h-10 w-10 border mr-3 rounded-sm" />
          ) : (
            <div className="h-10 border mr-3 flex rounded-sm justify-center items-center w-10">
              <UserRound className="h-6 w-6" />
            </div>
          )}
          <Markdown
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0 first:mt-0">{children}</p>;
              },
            }}
            className="prose break-words prose-p:leading-relaxed prose-pre:p-0 flex-1"
            rehypePlugins={[rehypeRaw]}
          >
            {message.content}
          </Markdown>
        </div>
      )}
    </>
  );
}
