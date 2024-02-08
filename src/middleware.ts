import { auth } from "@/auth";

const authRoutes = ["/login"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const { nextUrl } = req;

  const isAuthRoute = authRoutes.some((prefix) => req.nextUrl.pathname.startsWith(prefix));

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }
  }

  if (!isLoggedIn && nextUrl.pathname === "/") {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
