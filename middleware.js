import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/www(.*)",
    "/app/sign-up",
    "/app/sign-in",
  ],
  beforeAuth(req, evt) {
    console.log(`we are before auth, req.nextURL is ${req.nextUrl}`)
  },
  afterAuth(auth, req, evt) {
    const url = req.nextUrl;
    console.log(`app route is ${url}`)

    const { pathname } = req.nextUrl;

    const hostname = req.headers.get("host");

    let currentHost = hostname
    .toLowerCase()
    .replace(`.localhost:3000`, "")
    .toLowerCase();

    // rewrites for app pages
    if (!pathname.startsWith("/api")) {
      if (currentHost === "app") {
        // handle users who aren't authenticated
        console.log(`app route is ${url.pathname}`)

        url.pathname = `/app${url.pathname}`;

      } else {
        url.pathname = `/www${url.pathname}`;

      }

      return NextResponse.rewrite(url);
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)","/","/(api|trpc)(.*)"],
};
