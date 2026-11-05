import type { APIRoute } from 'astro'
import { getCv, localeStaticPaths, type Locale } from '@/lib/cv'
import { toMarkdown } from '@/lib/markdown'

export const getStaticPaths = localeStaticPaths

export const GET: APIRoute = ({ props }) =>
  new Response(toMarkdown(getCv(props.locale as Locale)), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
