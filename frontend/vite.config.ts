import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// Import de type pour activer l'augmentation de module `UserConfig` de vite-react-ssg
// (rend la clé `ssgOptions` valide dans defineConfig).
import type {} from 'vite-react-ssg'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  // ssgOptions étendu par vite-react-ssg ; onFinished sera ajouté en Task 5.
  ssgOptions: {
    includedRoutes(paths: string[]) {
      return paths.filter((p) => !p.startsWith('/admin'))
    },
  },
})
