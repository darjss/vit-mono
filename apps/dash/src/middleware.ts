import "server-only";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TokenBucket } from "@/lib/rate-limit";
import { auth } from "./lib/session";

const getRequestBucket = new TokenBucket<string>(100, 1);
const postRequestBucket = new TokenBucket<string>(30, 1);

const publicPaths = [
  "/login",
  "/login/google",
  "/login/google/callback",
  "/_next",
  "/favicon.ico",
  "/public",
  "/api/trpc",
];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  console.log("Middleware");
  if (process.env.NODE_ENV === "development") {
    console.log("sending request to url:", request.url);
    return NextResponse.next();
  }
  if (request.method === "OPTIONS") {
    console.log("Middleware: Handling OPTIONS request, allowing.");
    return NextResponse.next();
  }
  const path = request.nextUrl.pathname;
  const clientIP = request.headers.get("X-Forwarded-For") ?? "";

  if (request.method === "GET" && !getRequestBucket.consume(clientIP, 1)) {
    return new NextResponse(null, { status: 429 });
  }
  if (request.method === "POST" && !postRequestBucket.consume(clientIP, 3)) {
    return new NextResponse(null, { status: 429 });
  }

  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath),
  );

  if (request.method === "GET" || request.method === "POST") {
    console.log("GET REQUEST MIDDLEWARE");
    if (isPublicPath) {
      return NextResponse.next();
    }

    // const result = await auth();
    // if (result.session === null) {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }

    return NextResponse.next();
  }

  // const originHeader = request.headers.get("Origin");
  // const hostHeader = request.headers.get("Host");

  // if (originHeader === null || hostHeader === null) {
  //   console.warn("Missing Origin or Host header for non-GET request");
  //   return new NextResponse(null, { status: 403 });
  // }

  // try {
  //   const origin = new URL(originHeader);
  //   if (origin.host !== hostHeader) {
  //     console.warn(
  //       `Origin (${origin.host}) does not match Host (${hostHeader})`,
  //     );
  //     return new NextResponse(null, { status: 403 });
  //   }
  // } catch {
  //   console.warn("Invalid Origin header:", originHeader);
  //   return new NextResponse(null, { status: 403 });
  // }

  if (isPublicPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value ?? null;
  if (!token) {
    return new NextResponse(null, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
