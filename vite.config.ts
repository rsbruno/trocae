import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      generatedRouteTree: "./src/routes/index.ts",
      routeFileIgnorePattern: "_components",
      routesDirectory: "./src/pages",
      routeFileIgnorePrefix: "-",
      autoCodeSplitting: true,
      quoteStyle: "single",
      target: "react"
    }),
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  envPrefix: ["VITE_", "FIREBASE_"]
});
