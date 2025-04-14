import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import type { AppRouter } from "@vit/api"; // Import the AppRouter
//  type from your shared package
import superjson, { SuperJSON } from "superjson";
// Function to get the URL of the Next.js backend
const getBackendUrl = () => {
  // Option 1: Use an environment variable (Recommended)
  // Set VITE_API_URL in your .env file for the Astro app
  const apiUrlFromEnv = import.meta.env.VITE_API_URL; // Use VITE_ prefix for Astro env vars exposed to client
  if (apiUrlFromEnv) return apiUrlFromEnv;

  // Option 2: Fallback for local development (adjust port if necessary)
  if (import.meta.env.DEV) {
    // Assuming Next.js runs on 3000 during dev
    return "http://localhost:3000/api/trpc";
  }

  // Option 3: Default or throw an error if no URL is found in production
  // This depends on your deployment strategy
  console.warn("API URL not configured via VITE_API_URL environment variable.");
  // Fallback to a relative path, might not work if domains differ or if Astro app isn't serving the API
  return "/api/trpc";
  // OR: throw new Error("API URL is not configured.");
};

const trpc = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === 'development' &&
          typeof window !== 'undefined') ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
      transformer: SuperJSON,
      headers: () => {
        const headers = new Headers();
        headers.set("x-trpc-source", "nextjs-react");
        return headers;
      },
    }),
  ],
});

export default trpc;
