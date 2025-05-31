import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    coverage: {
      provider: "c8",
      reporter: ["text", "lcov"],
    },
    exclude: [...configDefaults.exclude, "dist/**"],
  },
});
