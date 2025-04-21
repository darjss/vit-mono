// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel";
import node from "@astrojs/node";
const isProd = process.env.CONTEXT === "production";
// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [],
  },

  integrations: [react(), tailwind()],
  adapter: isProd
    ? vercel()
    : node({
        mode: "standalone",
      }),
});
