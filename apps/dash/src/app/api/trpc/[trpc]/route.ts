import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { appRouter } from "@vit/api";
import { createTRPCContext } from "@vit/api";

const allowedOrigin = "https://vit-mono-store.vercel.app"; // Allow your specific frontend origin

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = async (req: NextRequest) => {
  console.log("sent trpc request to", req.url);

  // Handle OPTIONS requests for CORS preflight
  if (req.method === "OPTIONS") {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, x-trpc-source"); // Adjust headers as needed
    headers.set("Access-Control-Max-Age", "86400"); // Cache preflight response for 1 day
    return new Response(null, { status: 204, headers });
  }

  // Handle actual GET/POST requests
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });

  // Add CORS headers to the actual response
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, x-trpc-source",
  ); // Ensure this matches OPTIONS

  return response;
};

export { handler as GET, handler as POST };
