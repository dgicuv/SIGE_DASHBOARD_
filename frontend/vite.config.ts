import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@custom": path.resolve(__dirname, "./src/custom-components"),
      "echarts": path.resolve(__dirname, "./src/lib/echarts-loader.js"),
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:5032",
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ["**/.git/**"],
    },
  },
});
