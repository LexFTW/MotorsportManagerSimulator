import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@entities": path.resolve(import.meta.dirname, "./src/entities"),
      "@features": path.resolve(import.meta.dirname, "./src/features"),
      "@shared": path.resolve(import.meta.dirname, "./src/shared"),
      "@app": path.resolve(import.meta.dirname, "./src/app"),
      "@pages": path.resolve(import.meta.dirname, "./src/pages"),
      "@widgets":                   path.resolve(import.meta.dirname, "./src/widgets"),
      "@motorsport/race-engine":    path.resolve(import.meta.dirname, "./packages/race-engine/src/index.ts"),
      "@features/multiplayer":      path.resolve(import.meta.dirname, "./src/features/multiplayer/index.ts"),
    },
  },
});