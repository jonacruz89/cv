// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// Public URL, needed for absolute og:image / canonical links.
// SITE_URL wins if set; on Vercel it falls back to the production domain automatically.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ??
  'http://localhost:4321'

// Static site: Vercel detects Astro and serves dist/ with no adapter needed.
export default defineConfig({
  site,
  vite: {
    plugins: [tailwindcss()]
  }
})
