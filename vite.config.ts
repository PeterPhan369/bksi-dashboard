import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3020,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8215',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, ''), 
      },
      '/manage': {
        target: 'http://127.0.0.1:3215/route/manage',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/manage/, ''), 
      },
    },
  }
});
