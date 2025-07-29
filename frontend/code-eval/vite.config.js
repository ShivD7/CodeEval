import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/CodeEval/",
  server: {
    open: true,
    port: 3000,
    configureServer: (server) => {
      server.middlewares.use((req, res, next) => {
        res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
        next();
      });
    }
  }
})
