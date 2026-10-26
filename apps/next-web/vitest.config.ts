import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    alias: {
      "server-only": "/src/__mocks__/server-only.ts",
    },
  },
});
