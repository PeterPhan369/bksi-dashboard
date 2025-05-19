import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3020,
    proxy: {
      '/services': {
        target: 'http://127.0.0.1:3200',
        changeOrigin: true,
      },
      '/service': {
        target: 'http://127.0.0.1:3200',
        changeOrigin: true,
      }
    },
  }

});
