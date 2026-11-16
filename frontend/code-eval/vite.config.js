import { fileURLToPath } from 'node:url'
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/CodeEval/',
  server: {
    port: 3000,
    fs: {
      allow: [
        searchForWorkspaceRoot(fileURLToPath(new URL('.', import.meta.url))),
        fileURLToPath(new URL('../../backend/catalog.json', import.meta.url)),
      ],
    },
  },
})
