import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.build.json",
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "react-outside-kit",
      fileName: "index",
      formats: ["es", "cjs"],
    },

    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
});