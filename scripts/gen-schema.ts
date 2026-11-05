// Generates src/data/cv.schema.json so VS Code autocompletes and validates cv.json.
import { writeFileSync } from 'node:fs'
import { z } from 'astro/zod'
import { cvSchema } from '../src/lib/schema.ts'

const schema = z.toJSONSchema(cvSchema, { io: 'input', unrepresentable: 'any' })
writeFileSync(new URL('../src/data/cv.schema.json', import.meta.url), JSON.stringify(schema, null, 2) + '\n')
console.log('✓ src/data/cv.schema.json')
