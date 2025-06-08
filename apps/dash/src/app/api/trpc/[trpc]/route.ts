import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@vit/api";


/**
 * Configure CORS headers for specific allowed origins
 */
const allowedOrigins = [
  "http://localhost:4321",
  "https://localhost:4321",
  "https://vit-store.darjs.workers.dev"
];

const setCorsHeaders = (res: Response, origin?: string | null) => {
  // Check if the origin is in the allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
  res.headers.set("Access-Control-Allow-Credentials", "true");
};

export const OPTIONS = (req: NextRequest) => {
  const response = new Response(null, {
    status: 204,
  });
  const origin = req.headers.get("origin");
  setCorsHeaders(response, origin);
  return response;
};

const handler = async (req: NextRequest) => {
  const resheaders = new Headers();
  const origin = req.headers.get("origin");
  
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
    response.headers.set(key, value);
  }
  setCorsHeaders(response, origin);
  return response;
};

export { handler as GET, handler as POST };
