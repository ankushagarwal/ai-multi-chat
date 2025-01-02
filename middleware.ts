import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const isLocalhost = host === "localhost:3000";

  // Go to /authenticate to set the authenticated cookie
  // without the cookie, the user will be redirected to /404
  // this is a hack to prevent someone from accessing the app without logging in
  if (request.nextUrl.pathname === "/authenticate") {
    const response = NextResponse.redirect(new URL("/", request.url));
    // const expirationDate = new Date();
    // expirationDate.setFullYear(expirationDate.getFullYear() + 10);

    response.cookies.set("authenticated", "true", {
      // expires: expirationDate,
      maxAge: 31556952000,
    });
    return response;
  }
  const authenticated = request.cookies.get("authenticated");
  if (!authenticated && !isLocalhost) {
    return NextResponse.redirect(new URL("/404", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/authenticate", "/settings"],
};
