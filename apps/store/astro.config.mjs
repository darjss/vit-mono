// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";
// https://astro.build/config
export default defineConfig({
  vite: {
    optimizeDeps: {
      exclude: ["@vit/api", "@vit/db"],
    },
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD
        ? { "react-dom/server": "react-dom/server.edge" }
        : undefined,
    },
    ssr: {
      external: ["node:path", "node:url", "node:fs", "node:crypto"],
    },
    build: {
      rollupOptions: {
        external: (id, importer, isResolved) => {
          // Externalize Node.js built-ins only
          if (id.startsWith("node:")) {
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
