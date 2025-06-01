// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import path from "node:path";

import cloudflare from "@astrojs/cloudflare";
// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@vit/api": path.resolve("../../packages/api/src"),
        "@vit/db": path.resolve("../../packages/db/src"),
        ...(import.meta.env.PROD
          ? { "react-dom/server": "react-dom/server.edge" }
          : {}),
      },
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
