// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import path from "node:path";

import cloudflare from "@astrojs/cloudflare";
// https://astro.build/config
export default defineConfig({
  output: "server",
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
        "node:buffer",
        "node:stream",
        "node:util",
        "redis",
      ],
      // Ensure actions are properly bundled
      noExternal: ["astro:actions", "astro:schema"],
    },
    optimizeDeps: {
      exclude: ["@vit/db", "@vit/api"],
    },
    build: {
      rollupOptions: {
        external: (id, importer, isResolved) => {
          // Always bundle Astro actions
          if (id.includes("astro:actions") || id.includes("astro:schema")) {
            return false;
          }

          // Bundle all @vit packages for actions to work
          if (
            id.startsWith("@vit/") ||
            id === "drizzle-orm" ||
            id.startsWith("drizzle-orm/")
          ) {
            return false;
          }

          // Only externalize Node.js built-ins and redis
          if (
            id.startsWith("node:") ||
            id === "redis" ||
            id.startsWith("redis/")
          ) {
            return true;
          }
          return false;
        },
      },
      minify: false,
    },
    plugins: [],
  },
  prefetch: {
    defaultStrategy: "viewport",
  },
  integrations: [react(), tailwind()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    cloudflareModules: false,
  }),
});
