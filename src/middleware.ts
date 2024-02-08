import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // next-auth関連のルートをチェック
  const isNextAuthRoute = nextUrl.pathname.startsWith("/api/auth/");

  // next-authのルートは認証チェックから除外
  if (isNextAuthRoute) {
    return; // 何もせずに処理を続行
  }

  // ログインページへのアクセス時、既にログインしていればホームページにリダイレクト
  if (isLoggedIn && nextUrl.pathname === "/login") {
    return Response.redirect(new URL("/", nextUrl));
  }

  // ログインしていない状態でログインページ以外にアクセスしようとした場合、ログインページにリダイレクト
  if (!isLoggedIn && nextUrl.pathname !== "/login") {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
