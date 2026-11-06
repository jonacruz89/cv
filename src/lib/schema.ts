import { z } from 'astro/zod'

/**
 * Schema for src/data/cv.json.
 * Anything marked as `localized` accepts either a plain value (same in every
 * language) or an object with one value per language: { "es": ..., "en": ... }.
 */

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]

const localized = <T extends z.ZodType>(value: T) =>
  z.union([value, z.object({ es: value, en: value })])

const text = localized(z.string())
const textList = localized(z.array(z.string()))

/** "2024", "2024-11" or "2024-11-15" */
const date = z
  .string()
  .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'Usa el formato YYYY, YYYY-MM o YYYY-MM-DD')

const sectionId = z.enum(['summary', 'work', 'education', 'skills', 'languages', 'contact'])

export const cvSchema = z.object({
  $schema: z.string().optional(),

  settings: z
    .object({
      defaultLocale: z.enum(LOCALES).default('es'),
      paper: z.enum(['letter', 'A4']).default('letter').describe('Tamaño de página al imprimir'),
      accentColor: z.string().default('#5754fc'),
      monogram: z.string().optional().describe('Iniciales grandes del diseño moderno, ej. "JC"'),
      seo: z
        .object({
          description: text.optional().describe('Texto corto (~155 caracteres) que se ve al compartir el enlace. Si falta, se usa el inicio de basics.summary')
        })
        .prefault({}),
      modern: z
        .object({
          sidebar: z.array(sectionId).default(['summary', 'skills', 'languages', 'contact']),
          main: z.array(sectionId).default(['work', 'education']),
          showWorkSkills: z.boolean().default(true)
        })
        .prefault({}),
      harvard: z
        .object({
          sections: z.array(sectionId).default(['summary', 'work', 'education', 'skills', 'languages']),
          maxHighlights: z.number().int().positive().optional().describe('Máximo de logros por trabajo')
        })
        .prefault({})
    })
    .prefault({}),

  basics: z.object({
    name: z.string(),
    label: text.describe('Título profesional'),
    email: z.email().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional().describe('Número sin "+" ni espacios, ej. 573001234567'),
    location: text.optional(),
    website: z.url().optional(),
    summary: text.optional(),
    profiles: z
      .array(
        z.object({
          network: z.string(),
          username: z.string().optional(),
          url: z.url()
        })
      )
      .default([])
  }),

  work: z
    .array(
      z.object({
        company: z.string(),
        position: text,
        location: text.optional(),
        url: z.url().optional(),
        startDate: date.optional().describe('Vacío = sin fechas (ej. freelance)'),
        endDate: date.optional().describe('Vacío = actualidad'),
        summary: text.optional(),
        highlights: textList.default([]),
        skills: z.array(z.string()).default([]),
        hidden: z.boolean().default(false)
      })
    )
    .default([]),

  education: z
    .array(
      z.object({
        institution: z.string(),
        area: text,
        location: text.optional(),
        startDate: date.optional(),
        endDate: date.optional(),
        highlights: textList.default([]),
        hidden: z.boolean().default(false)
      })
    )
    .default([]),

  skills: z
    .array(
      z.object({
        name: text,
        keywords: textList,
        harvard: z.boolean().default(true).describe('false = no mostrar este grupo en el formato Harvard')
      })
    )
    .default([]),

  languages: z
    .array(
      z.object({
        language: text,
        fluency: text
      })
    )
    .default([])
})

export type CV = z.infer<typeof cvSchema>
