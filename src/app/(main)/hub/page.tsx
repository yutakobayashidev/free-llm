import { auth } from "@/auth";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { cn } from "@/lib/utils";
import { desc, eq, or, sql } from "drizzle-orm";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface SearchParamsProps {
  searchParams: {
    page: string;
  };
}

export default async function Page({ searchParams }: SearchParamsProps) {
  const session = await auth();

  const pageNumber = Number(searchParams.page ?? 1);

  const numberOfItems = 6;

  const totalChats = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.chats)
    .where(or(eq(schema.chats.publishStatus, "public"), session?.user ? eq(schema.chats.publishStatus, "guild") : undefined));

  const numberOfPages = Math.ceil(totalChats[0].count / numberOfItems);

  let safePageNumber = 1;

  if (pageNumber < 1) {
    redirect("/hub");
  } else if (pageNumber > numberOfPages) {
    redirect("/hub");
  } else {
    safePageNumber = pageNumber;
  }

  const offsetItems = safePageNumber > 1 ? (safePageNumber - 1) * numberOfItems : 0;

  const chats = await db.query.chats.findMany({
    where: or(eq(schema.chats.publishStatus, "public"), session?.user ? eq(schema.chats.publishStatus, "guild") : undefined),
    orderBy: [desc(schema.chats.createdAt)],
    with: {
      user: true,
      messages: true,
    },
    offset: offsetItems,
    limit: 10,
  });

  const prevSearchParams = new URLSearchParams();
  const nextSearchParams = new URLSearchParams();

  if (safePageNumber > 2) {
    prevSearchParams.set("page", `${safePageNumber - 1}`);
  } else {
    prevSearchParams.delete("page");
  }

  if (safePageNumber > 0) {
    if (safePageNumber === numberOfPages) {
      nextSearchParams.set("page", `${numberOfPages}`);
    } else {
      nextSearchParams.set("page", `${safePageNumber + 1}`);
    }
  } else {
    nextSearchParams.delete("page");
  }

  const startPage = Math.max(1, safePageNumber - 1);
  const endPage = Math.min(numberOfPages, safePageNumber + 1);

  return (
    <div className="main-content w-full overflow-y-auto py-8 px-4">
      <h1 className="text-2xl mb-5 font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">Message Hub</h1>
      <p className="mb-5">公開・サーバーの参加者限定のチャット一覧</p>
      <div className="space-y-5 mb-5">
        {chats.map((chat) => (
          <Link href={`/hub/${chat.id}`} className="flex justify-between items-center" key={chat.id}>
            <div className="gap-x-3 flex items-center">
              <img
                className="w-10 rounded-sm border h-10"
                alt={chat.user.name ?? "不明なユーザー"}
                src={chat.user.image ?? "https://via.placeholder.com/150"}
              />
              <h2 className="line-clamp-1 font-semibold flex items-start">{chat.title}</h2>
              <p className="text-sm text-gray-400">{chat.user.name}</p>
            </div>
            <div className="flex gap-x-3 items-center">
              <div className="flex text-sm items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                <p className="text-gray-500">{chat.messages.length}</p>
              </div>
              <div
                className={cn(
                  {
                    "bg-blue-200 text-blue-500": chat.publishStatus === "guild",
                    "bg-purple-200 text-purple-500": chat.publishStatus === "public",
                    "px-2 py-1 rounded-md": true,
                  },
                  "px-2 py-1 rounded-md text-sm",
                )}
              >
                {chat.publishStatus === "guild" ? "サーバー内" : "公開"}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div>
        <Pagination className="flex justify-end">
          <PaginationContent>
            {safePageNumber > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`/hub?${prevSearchParams}`} />
              </PaginationItem>
            )}
            {[...Array(endPage - startPage + 1)].map((_, index) => {
              const page = startPage + index;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`/hub?page=${page}`}
                    className={cn({ "bg-primary hover:bg-primary/90 hover:text-white text-white": page === safePageNumber })}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {safePageNumber < numberOfPages && (
              <PaginationItem>
                <PaginationNext href={`/hub?${nextSearchParams}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
