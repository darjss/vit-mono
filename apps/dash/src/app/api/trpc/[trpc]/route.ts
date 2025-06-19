import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@vit/api";

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
  }

  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, x-trpc-source, Authorization, Cookie",
  );
  res.headers.set("Access-Control-Expose-Headers", "Set-Cookie");
};

const handler = async (req: NextRequest) => {
  const resheaders = new Headers();
  const origin = req.headers.get("origin");

  // Debug cookie information
  console.log("🔴 NextJS req.cookies:", req.cookies.getAll());
  console.log("🔴 Raw Cookie header:", req.headers.get("cookie"));

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

export { handler as GET, handler as POST };
