import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { appRouter } from "@vit/api";
import { createTRPCContext } from "@vit/api";

// Allowed origin check is now primarily handled in middleware,
// but we still need it here to set the header on the *actual* response.
const allowedOrigin = "https://vit-mono-store.vercel.app";

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
  console.log(
    "tRPC Handler: Received request for",
    req.url,
    "Method:",
    req.method,
  );

  // Middleware should have already handled OPTIONS requests.
  // If an OPTIONS request somehow reaches here, fetchRequestHandler might handle it,
  // or it might result in an error depending on the adapter version.

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

  // Add CORS headers to the actual tRPC response.
  // Important: Check the origin of the request dynamically if needed,
  // or rely on the middleware having set it correctly.
  // Here we use the statically defined one for simplicity, assuming middleware allows it.
  const requestOrigin = req.headers.get("origin");
  if (requestOrigin === allowedOrigin) {
    // Or check against allowedOrigins array if middleware doesn't block
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    // Potentially add other headers like Allow-Credentials if needed and configured
    // response.headers.set('Access-Control-Allow-Credentials', 'true');
  } else if (requestOrigin) {
    console.warn(
      `tRPC Handler: Request origin "${requestOrigin}" not in allowed list "${allowedOrigin}". Not adding CORS header.`,
    );
  } else {
    console.log("tRPC Handler: Request does not have an Origin header.");
  }

  // You might still need to set Allow-Methods and Allow-Headers here
  // if the fetchRequestHandler doesn't do it automatically based on router config.
  // However, for the actual response (not preflight), only Allow-Origin
  // and potentially Allow-Credentials are strictly required by the browser.
  // response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  // response.headers.set("Access-Control-Allow-Headers", "Content-Type, x-trpc-source");

  console.log("tRPC Handler: Sending response with status", response.status);
  return response;
};

export { handler as GET, handler as POST };
