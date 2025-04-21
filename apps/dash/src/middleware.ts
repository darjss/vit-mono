import "server-only";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TokenBucket } from "@/lib/rate-limit";
// import { auth } from "./lib/session"; // Keep auth commented if not used

const getRequestBucket = new TokenBucket<string>(100, 1);
const postRequestBucket = new TokenBucket<string>(30, 1);

// Define allowed origins - update if you need more
const allowedOrigins = [
  "https://vit-mono-store.vercel.app",
  // Add localhost for development if needed: e.g., "http://localhost:4321"
];

const publicPaths = [
  "/login",
  "/login/google",
  "/login/google/callback",
  "/_next",
  "/favicon.ico",
  "/public",
  "/api/trpc", // Ensure /api/trpc is considered public for direct access check later
];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  const requestHeaders = new Headers(request.headers); // Headers for downstream request

  // Default response (will be modified)
  let response = NextResponse.next({
    request: {
      // Apply new request headers if needed
      headers: requestHeaders,
    },
  });

  // Check if the origin is allowed
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    console.log("Middleware: Handling OPTIONS request");
    if (isAllowedOrigin) {
      const preflightHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Add other methods if needed
        "Access-Control-Allow-Headers": "Content-Type, x-trpc-source", // Add other headers if needed by client
        "Access-Control-Max-Age": "86400", // Cache preflight response for 1 day
      };
      return new NextResponse(null, { status: 204, headers: preflightHeaders });
    } else {
      console.warn(
        `Middleware: Blocked OPTIONS request from disallowed origin: ${origin}`,
      );
      // Optionally return a 403 or similar if you want to explicitly deny
      return new NextResponse(null, { status: 204 }); // Return empty 204 even for disallowed origins for OPTIONS
    }
  }

  // Add CORS headers to the actual responses for allowed origins
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    // Add other CORS headers if needed, e.g., credentials
    // response.headers.set('Access-Control-Allow-Credentials', 'true');
  } else if (origin) {
    console.warn(`Middleware: Request from disallowed origin: ${origin}`);
    // Decide if you want to block here or let the route handler decide
    // For now, we let it pass but without the CORS header
  }

  // --- Rest of your middleware logic ---
  console.log(
    "Middleware running for:",
    request.method,
    request.nextUrl.pathname,
  );

  // Development bypass
  if (process.env.NODE_ENV === "development") {
    console.log("Middleware (DEV): Bypassing checks for url:", request.url);
    return response; // Return response with potential CORS headers added
  }

  const path = request.nextUrl.pathname;
  // Use X-Forwarded-For, providing a fallback value if header is missing
  const clientIP = request.headers.get("X-Forwarded-For") ?? "";

  // Rate limiting
  if (request.method === "GET" && !getRequestBucket.consume(clientIP, 1)) {
    console.warn(
      `Middleware: Rate limit exceeded for GET request from ${clientIP}`,
    );
    return new NextResponse("Too Many Requests", { status: 429 });
  }
  if (request.method === "POST" && !postRequestBucket.consume(clientIP, 3)) {
    console.warn(
      `Middleware: Rate limit exceeded for POST request from ${clientIP}`,
    );
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath),
  );

  if (isPublicPath) {
    console.log("Middleware: Accessing public path:", path);
    return response; // Allow public paths, return response with potential CORS headers
  }

  // --- Authentication/Authorization (Example - keep commented if not needed) ---
  // const result = await auth(); // Assuming auth() checks cookie/session
  // if (result.session === null) {
  //   console.log("Middleware: No session found, redirecting to login for path:", path);
  //   const loginUrl = new URL("/login", request.url);
  //   // Add CORS headers even to redirects if needed, although usually not required
  //   const redirectResponse = NextResponse.redirect(loginUrl);
  //   if (isAllowedOrigin) {
  //        redirectResponse.headers.set("Access-Control-Allow-Origin", origin);
  //   }
  //   return redirectResponse;
  // }
  // console.log("Middleware: Session found, allowing access to:", path);
  // --- End Auth Example ---

  console.log("Middleware: Path allowed:", path);
  return response; // Return the final response
}

export const config = {
  // Adjust matcher if needed, ensure it covers /api/trpc
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/trpc/:path*", // Explicitly include tRPC routes if necessary
  ],
};
