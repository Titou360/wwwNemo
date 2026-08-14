import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// Import de type pour activer l'augmentation de module `UserConfig` de vite-react-ssg
// (rend la clé `ssgOptions` valide dans defineConfig).
import type {} from 'vite-react-ssg'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getPublicPaths } from './scripts/sitemap-paths'

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
    dirStyle: 'nested',
    includedRoutes(paths: string[]) {
      return paths.filter((p) => !p.startsWith('/admin'))
    },
    onFinished() {
      const base = 'https://www.nemosolutions.fr'
      const urls = getPublicPaths()
        .map((p) => `  <url><loc>${base}${p === '/' ? '/' : p}</loc></url>`)
        .join('\n')
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      const outPath = fileURLToPath(new URL('./dist/sitemap.xml', import.meta.url))
      writeFileSync(outPath, xml)
    },
  },
})
