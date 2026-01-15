import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/quotes": {
        target: "https://zenquotes.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/quotes/, ""),
      },
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.js",
    css: true,
  },
});
