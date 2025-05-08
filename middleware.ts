import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  if ((accessToken || refreshToken) && pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!accessToken && !refreshToken && pathname === "/") {
    return NextResponse.next();
  }

  if (accessToken || refreshToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  } else {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
