import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    exclude: ["zod", "chart"],
  },
});
