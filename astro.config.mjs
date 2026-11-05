// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// Static site: Vercel detects Astro and serves dist/ with no adapter needed.
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
})
