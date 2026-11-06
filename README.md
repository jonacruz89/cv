# CV – Jonathan Cruz

Hoja de vida generada desde un solo archivo de datos. No hay que tocar HTML: todo se edita en
[`src/data/cv.json`](src/data/cv.json).

## Rutas

| Ruta | Qué es |
| --- | --- |
| `/` · `/en/` | Diseño moderno (dos columnas) |
| `/harvard` · `/en/harvard` | Formato Harvard: una columna, serif, sobrio |
| `/cv.md` · `/en/cv.md` | El CV en Markdown, para copiar y pegar |

Cada página tiene un botón **Imprimir / PDF**. Usa "Guardar como PDF" en el diálogo de impresión;
la barra de navegación no sale impresa.

## Editar el CV

- **Datos**: `src/data/cv.json`. VS Code autocompleta y valida gracias a `cv.schema.json`.
- **Traducciones**: cualquier texto acepta un valor único (`"Bogotá, Colombia"`) o uno por idioma
  (`{ "es": "Inglés", "en": "English" }`).
- **Fechas**: `YYYY`, `YYYY-MM` o `YYYY-MM-DD`. Si un trabajo no tiene `endDate`, se muestra "Actualidad".
- **Ocultar** un trabajo o estudio sin borrarlo: `"hidden": true`.
- **Ocultar un grupo de skills solo en Harvard** (por ejemplo, habilidades blandas): `"harvard": false`.
  En Harvard, los idiomas salen como una línea más dentro de Habilidades.
- **Años de experiencia**: escribe `{years}` en el resumen y se calcula desde el trabajo más antiguo.
- **Textos de la interfaz** (títulos de secciones, botones): `src/data/ui.json`.

### `settings`

| Campo | Para qué |
| --- | --- |
| `defaultLocale` | Idioma que se sirve en `/` |
| `paper` | `letter` (Carta) o `A4` al imprimir |
| `accentColor` | Color de la franja, títulos y etiquetas del diseño moderno |
| `monogram` | Iniciales grandes del diseño moderno |
| `seo.description` | Texto corto que se ve al compartir el enlace (WhatsApp, LinkedIn…) |
| `modern.sidebar` / `modern.main` | Qué secciones van en cada columna y en qué orden |
| `modern.showWorkSkills` | Mostrar las etiquetas de tecnologías en cada trabajo |
| `harvard.sections` | Secciones y orden del formato Harvard (y del Markdown) |
| `harvard.maxHighlights` | Máximo de logros por trabajo en Harvard |

Secciones disponibles: `summary`, `work`, `education`, `skills`, `languages`, `contact`.

Si `cv.json` tiene un error (campo faltante, fecha mal escrita), el build falla y dice exactamente dónde.

## Comandos

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # valida tipos y genera dist/
pnpm schema    # regenera cv.schema.json si cambias src/lib/schema.ts
pnpm og        # regenera las imágenes para compartir (public/og.png, og-en.png)
```

## Al compartir el enlace

Título, descripción, imagen y datos estructurados salen de `cv.json`. La imagen de 1200×630 se genera
desde `src/pages/[...lang]/og-image.astro` con Chrome local: corre `pnpm og` cuando cambies tu
nombre, título, skills o color, y sube los PNG.

La URL pública se toma sola en Vercel. Si usas un dominio propio que no es el de producción de
Vercel, define `SITE_URL` (por ejemplo `https://cv.midominio.com`) en las variables de entorno.

WhatsApp y LinkedIn guardan en caché la vista previa. Para forzar la nueva en LinkedIn usa
[Post Inspector](https://www.linkedin.com/post-inspector/).

## Estructura

```
src/
  data/cv.json          datos del CV
  data/ui.json          textos de interfaz por idioma
  lib/schema.ts         esquema (Zod) que valida cv.json
  lib/cv.ts             resuelve idioma, fechas y contacto
  lib/markdown.ts       genera el Markdown
  templates/            Modern.astro, Harvard.astro
  pages/[...lang]/      rutas (/ para español, /en/ para inglés)
```

Para agregar una plantilla nueva: crea `src/templates/X.astro` que reciba `cv`, y una página
`src/pages/[...lang]/x.astro` igual a `harvard.astro`.

## Despliegue

Sitio 100% estático. Vercel detecta Astro automáticamente; no necesita adaptador.
