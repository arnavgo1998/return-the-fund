/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Link previews (LinkedIn, Facebook) need absolute URLs. On Vercel this comes from the production domain;
// elsewhere set VITE_SITE_URL. Without either, the tags fall back to relative paths.
const siteUrl = (
  process.env.VITE_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")
).replace(/\/$/, "");

export default defineConfig({
  plugins: [react(), { name: "absolute-share-urls", transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteUrl) }],
  test: { environment: "jsdom", setupFiles: ["./src/test-setup.ts"], css: false },
});
