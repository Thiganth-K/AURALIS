import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "auralis_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "auralis-super-secret-development-jwt-key-2026-min-32-chars"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Static files, Next.js internals, and assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Allow API routes to perform their own auth handling & status responses
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 3. Inspect session token
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  let session: { userId: string; role: "user" | "admin" } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload && payload.userId) {
        session = {
          userId: payload.userId as string,
          role: payload.role as "user" | "admin",
        };
      }
    } catch {
      session = null;
    }
  }

  const isAuthPage = pathname === "/login" || pathname === "/register";

  // 4. If NOT authenticated:
  if (!session) {
    // If already on /login or /register, let them proceed
    if (isAuthPage) {
      return NextResponse.next();
    }

    // Force user to start with the login page
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/" && pathname !== "/home") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 5. If ALREADY authenticated and visiting /login or /register:
  if (isAuthPage) {
    const destination = session.role === "admin" ? "/admin" : "/home";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 6. Admin portal protection
  if (pathname.startsWith("/admin") && session.role !== "admin") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // 7. Route / directly to /home when authenticated
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (api)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (files with extensions)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
