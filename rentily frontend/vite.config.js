import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy /api requests to the backend so there are no CORS issues in dev
    proxy: {
      "/api": {
        target: "http://localhost:4242",
        changeOrigin: true,
      },
    },
  },
});
