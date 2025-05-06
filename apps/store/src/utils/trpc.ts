import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@vit/api";
import type { TRPCLink } from "@trpc/client";
import superjson, { SuperJSON } from "superjson";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { observable } from "@trpc/server/observable";

const getBackendUrl = () => {
  const apiUrlFromEnv = import.meta.env.PUBLIC_API_URL;
  if (apiUrlFromEnv) return apiUrlFromEnv;

  if (import.meta.env.DEV) {
    return "http://localhost:3000/api/trpc";
  }
  console.warn("API URL not configured via VITE_API_URL environment variable.");
  return "http://localhost:3000/api/trpc";
};

export const queryClient = new QueryClient();

const timingLink: TRPCLink<AppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const startTime = Date.now();
      const unsubscribe = next(op).subscribe({
        next(value) {
          const duration = Date.now() - startTime;
          console.log(`[TRPC Request] ${op.path} completed in ${duration}ms`);
          observer.next(value);
        },
        error(err) {
          const duration = Date.now() - startTime;
          console.error(
            `[TRPC Request] ${op.path} failed in ${duration}ms`,
            err
          );
          observer.error(err);
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

export const api = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" &&
          typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    timingLink,
    httpBatchLink({
      url: getBackendUrl(),
      transformer: SuperJSON,
      headers: () => {
        const headers = new Headers();
        headers.set("x-trpc-source", "nextjs-react");
        return headers;
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: api,
  queryClient,
});


