import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@vit/api";
import { cookies } from "next/headers";

/**
 * Configure CORS headers for specific allowed origins
 */
const allowedOrigins = [
  "http://localhost:4321",
  "https://localhost:4321",
  "https://vit-store.darjs.workers.dev",
];

const setCorsHeaders = (res: Response, origin?: string | null) => {
  // Check if the origin is in the allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
  } else {
    // For debugging: log when origin is not in allowed list
    console.log(
      "🔴 Origin not in allowed list:",
      origin,
      "Allowed:",
      allowedOrigins,
    );
  }

  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, x-trpc-source, Authorization, Cookie, x-requested-with",
  );
  res.headers.set("Access-Control-Expose-Headers", "Set-Cookie");
  res.headers.set("Access-Control-Max-Age", "86400"); // Cache preflight for 24 hours
};

const handler = async (req: NextRequest) => {
  const resheaders = new Headers();
  const origin = req.headers.get("origin");

  // Handle OPTIONS preflight requests
  if (req.method === "OPTIONS") {
    const response = new Response(null, { status: 200 });
    setCorsHeaders(response, origin);
    return response;
  }

  const cookieStore = await cookies();
  // Cookie debugging - now that SameSite is fixed, these should show cookies
  console.log("🔴 Raw Cookie header:", req.headers.get("cookie"));
  console.log(
    "🔴 Store session cookie:",
    req.cookies.get("store_session")?.value,
  );

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
        resHeaders: resheaders,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  for (const [key, value] of resheaders.entries()) {
    console.log("🔴 Response header:", key, value);
    response.headers.set(key, value);
  }
  setCorsHeaders(response, origin);
  return response;
};

export { handler as GET, handler as POST, handler as OPTIONS };
