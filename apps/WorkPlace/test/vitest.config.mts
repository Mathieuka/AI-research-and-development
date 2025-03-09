import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    include: ["src/**/*.test.[jt]s?(x)"],
    setupFiles: [path.resolve(__dirname, "setup.ts")],
  },
});
