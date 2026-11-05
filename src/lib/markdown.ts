import type { ResolvedCv } from '@/lib/cv'

/** Plain-text CV in Markdown, following the Harvard section order. */
export function toMarkdown (cv: ResolvedCv): string {
  const { labels, basics } = cv
  const out: string[] = []
  const push = (...lines: string[]) => out.push(...lines)

  push(`# ${basics.name}`, '', `**${basics.label}**`, '')
  push(cv.contact.map((c) => (c.href ? `[${c.label}](${c.href})` : c.label)).join(' · '), '')

  for (const id of cv.settings.harvard.sections) {
    switch (id) {
      case 'summary':
        if (basics.summary) push(`## ${labels.summary}`, '', basics.summary, '')
        break
      case 'work':
        if (!cv.work.length) break
        push(`## ${labels.work}`, '')
        for (const w of cv.work) {
          push(`### ${w.position} — ${w.company}`, '')
          push(`*${[w.dates, w.location].filter(Boolean).join(' · ')}*`, '')
          if (w.summary) push(w.summary, '')
          if (w.highlights.length) push(...w.highlights.map((h) => `- ${h}`), '')
          if (w.skills.length) push(`**Stack:** ${w.skills.join(', ')}`, '')
        }
        break
      case 'education':
        if (!cv.education.length) break
        push(`## ${labels.education}`, '')
        for (const e of cv.education) {
          push(`### ${e.area} — ${e.institution}`, '')
          push(`*${[e.dates, e.location].filter(Boolean).join(' · ')}*`, '')
          if (e.highlights.length) push(...e.highlights.map((h) => `- ${h}`), '')
        }
        break
      case 'skills':
        if (!cv.skills.length) break
        push(`## ${labels.skills}`, '', ...cv.skills.map((s) => `- **${s.name}:** ${s.keywords.join(', ')}`), '')
        break
      case 'languages':
        if (!cv.languages.length) break
        push(`## ${labels.languages}`, '', ...cv.languages.map((l) => `- ${l.language} — ${l.fluency}`), '')
        break
    }
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}
