// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";
// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD
        ? { "react-dom/server": "react-dom/server.edge" }
        : undefined,
    },
    ssr: {
      external: [
        "node:path",
        "node:url",
        "node:fs",
        "node:crypto",
        "@vit/db",
        "@vit/api",
      ],
    },
    optimizeDeps: {
      exclude: ["@vit/db", "@vit/api"],
    },
    build: {
      rollupOptions: {
        external: (id, importer, isResolved) => {
          // Externalize Node.js built-ins and @vit packages completely
          if (
            id.startsWith("node:") ||
            id === "@vit/db" ||
            id.startsWith("@vit/db/") ||
            id === "@vit/api" ||
            id.startsWith("@vit/api/")
          ) {
            return true;
          }
          return false;
        },
      },
    },
    plugins: [],
  },
  prefetch: {
    defaultStrategy: "viewport",
  },
  integrations: [react(), tailwind()],
  adapter: cloudflare(),
});
