import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { appRouter } from "@vit/api";
import { createTRPCContext } from "@vit/api";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

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


  const requestOrigin = req.headers.get("origin");
  if (requestOrigin === allowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  } else if (requestOrigin) {
    console.warn(
      `tRPC Handler: Request origin "${requestOrigin}" not in allowed list "${allowedOrigin}". Not adding CORS header.`,
    );
  } else {
    console.log("tRPC Handler: Request does not have an Origin header.");
  }


  console.log("tRPC Handler: Sending response with status", response.status);
  return response;
};

export { handler as GET, handler as POST };
