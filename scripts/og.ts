// Renders the share images (public/og.png, public/og-<lang>.png) with a local Chrome.
// Run `pnpm og` after changing your name, title, skills or accent color, then commit the PNGs.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = new URL('..', import.meta.url)
const cv = JSON.parse(readFileSync(new URL('src/data/cv.json', root), 'utf8'))
const defaultLocale: string = cv.settings?.defaultLocale ?? 'es'
const locales = ['es', 'en']

const chrome = [process.env.CHROME_PATH, 'google-chrome', 'chromium', 'chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((bin) => {
  if (!bin) return false
  try { execFileSync(bin, ['--version'], { stdio: 'ignore' }); return true } catch { return false }
})
if (!chrome) throw new Error('No encontré Chrome. Define CHROME_PATH con la ruta del ejecutable.')

for (const locale of locales) {
  const dir = locale === defaultLocale ? '' : `${locale}/`
  const html = fileURLToPath(new URL(`dist/${dir}og-image/index.html`, root))
  if (!existsSync(html)) throw new Error(`Falta ${html}. Corre "pnpm build" primero.`)
  const out = fileURLToPath(new URL(`public/${locale === defaultLocale ? 'og' : `og-${locale}`}.png`, root))
  execFileSync(chrome, ['--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', `--screenshot=${out}`, `file://${html}`], { stdio: 'ignore' })
  console.log(`✓ ${out.replace(fileURLToPath(root), '')}`)
}
