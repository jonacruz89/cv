import rawCv from '@/data/cv.json'
import ui from '@/data/ui.json'
import { cvSchema, LOCALES, type Locale } from '@/lib/schema'

export { LOCALES, type Locale }

/** Validated CV data. A typo in cv.json fails the build with a clear message. */
const parsed = cvSchema.safeParse(rawCv)
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n')
  throw new Error(`src/data/cv.json no es válido:\n${issues}`)
}
const data = parsed.data

type Localized<T> = T | Record<Locale, T>

const isLocalized = <T>(value: Localized<T>): value is Record<Locale, T> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Pick the value for a locale from a localized field. */
export const pick = <T>(value: Localized<T>, locale: Locale): T =>
  isLocalized(value) ? value[locale] : value

export const pickOptional = <T>(value: Localized<T> | undefined, locale: Locale): T | undefined =>
  value === undefined ? undefined : pick(value, locale)

/** "2024-11" -> "nov 2024" / "Nov 2024"; "2019" -> "2019". */
export function formatDate (date: string, locale: Locale): string {
  const [year, month] = date.split('-')
  if (!month) return year
  const formatted = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)))
    .replace('.', '')
    .replace(' de ', ' ')
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function formatRange (start: string | undefined, end: string | undefined, locale: Locale, ongoing = true): string {
  const from = start ? formatDate(start, locale) : ''
  const to = end ? formatDate(end, locale) : (ongoing ? ui[locale].present : '')
  if (from && to && from !== to) return `${from} – ${to}`
  return from || to
}

export type Labels = (typeof ui)['es']
export type SectionId = 'summary' | 'work' | 'education' | 'skills' | 'languages' | 'contact'

export interface ContactItem { kind: 'email' | 'phone' | 'location' | 'website' | 'profile', label: string, href?: string }

/** CV data fully resolved for one language: plain strings, formatted dates, hidden items removed. */
export function getCv (locale: Locale) {
  const { settings, basics } = data

  const contact: ContactItem[] = [
    basics.email && { kind: 'email' as const, label: basics.email, href: `mailto:${basics.email}` },
    basics.phone && {
      kind: 'phone' as const,
      label: basics.phone,
      href: basics.whatsapp ? `https://wa.me/${basics.whatsapp}` : `tel:${basics.phone.replace(/\s/g, '')}`
    },
    basics.location && { kind: 'location' as const, label: pick(basics.location, locale) },
    basics.website && { kind: 'website' as const, label: basics.website.replace(/^https?:\/\//, ''), href: basics.website },
    ...basics.profiles.map((p) => ({
      kind: 'profile' as const,
      label: p.url.replace(/^https?:\/\/(www\.)?/, ''),
      href: p.url
    }))
  ].filter((item) => !!item)

  return {
    locale,
    labels: ui[locale],
    settings,
    basics: {
      name: basics.name,
      label: pick(basics.label, locale),
      email: basics.email,
      summary: pickOptional(basics.summary, locale),
      location: pickOptional(basics.location, locale),
      profiles: basics.profiles
    },
    contact,
    work: data.work
      .filter((w) => !w.hidden)
      .map((w) => ({
        company: w.company,
        url: w.url,
        position: pick(w.position, locale),
        location: pickOptional(w.location, locale),
        dates: formatRange(w.startDate, w.endDate, locale),
        summary: pickOptional(w.summary, locale),
        highlights: pick(w.highlights, locale),
        skills: w.skills
      })),
    education: data.education
      .filter((e) => !e.hidden)
      .map((e) => ({
        institution: e.institution,
        area: pick(e.area, locale),
        location: pickOptional(e.location, locale),
        dates: formatRange(e.startDate, e.endDate, locale, false),
        highlights: pick(e.highlights, locale)
      })),
    skills: data.skills.map((s) => ({ name: pick(s.name, locale), keywords: pick(s.keywords, locale) })),
    languages: data.languages.map((l) => ({ language: pick(l.language, locale), fluency: pick(l.fluency, locale) }))
  }
}

export type ResolvedCv = ReturnType<typeof getCv>

export const defaultLocale = data.settings.defaultLocale

/** Base path for a locale: the default locale lives at "/", the rest at "/<locale>/". */
export const localePath = (locale: Locale, page = '') =>
  (locale === defaultLocale ? '/' : `/${locale}/`) + page

/** getStaticPaths helper for src/pages/[...lang]/ routes. */
export const localeStaticPaths = () =>
  LOCALES.map((locale) => ({
    params: { lang: locale === defaultLocale ? undefined : locale },
    props: { locale }
  }))
