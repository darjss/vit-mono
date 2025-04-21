import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@vit/api"; 
import superjson, { SuperJSON } from "superjson";
import { QueryClient } from '@tanstack/react-query';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';

const getBackendUrl = () => {
  const apiUrlFromEnv = import.meta.env.PUBLIC_API_URL;
  if (apiUrlFromEnv) return apiUrlFromEnv;

  if (import.meta.env.DEV) {
    // Assuming Next.js runs on 3000 during dev
    return "http://localhost:3000/api/trpc";
  }
  console.warn("API URL not configured via VITE_API_URL environment variable.");
  return "http://localhost:3000/api/trpc";
};

export const queryClient = new QueryClient();

const api = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" &&
          typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
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

export default api;
