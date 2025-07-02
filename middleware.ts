import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerToken } from "./lib/auth-server";

// Define paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/orders",
  "/profile",
  "/cart",
  "/checkout",
];

// Define paths that are only accessible when not authenticated
const authPaths = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const token = await getServerToken();
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => pathname === path);

  // If the path requires authentication and there's no token, redirect to sign-in
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is authenticated and tries to access auth pages, redirect to home
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure the paths that trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
