// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel";
import node from "@astrojs/node";
import cloudflare from "@astrojs/cloudflare";
const isVercel = process.env.VERCEL === "1";
// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [],
  },

  integrations: [react(), tailwind()],
  adapter: cloudflare(),
});