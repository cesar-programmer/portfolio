import { LANGS, SITE_URL, type Lang } from './config'
import { getContent } from './content'
import { isLang, parsePath, recruiterPath, sectionPath, SECTIONS, type GameLocation } from './routes'

/** Metadatos de una página. Los usan el prerender (HTML estático) y el cliente al navegar. */
export type Head = {
  lang: Lang
  path: string
  title: string
  description: string
  canonical: string
  alternates: { hreflang: string; href: string }[]
  image: string
  imageAlt: string
  type: 'website' | 'profile'
  noindex: boolean
}

const OG_LOCALE: Record<Lang, string> = { es: 'es_MX', en: 'en_US' }
const abs = (path: string) => `${SITE_URL}${path}`

function alternatesFor(build: (lang: Lang) => string) {
  return [
    ...LANGS.map((lang) => ({ hreflang: lang, href: abs(build(lang)) })),
    { hreflang: 'x-default', href: abs('/') },
  ]
}

function gameHead(loc: GameLocation, path: string): Head {
  const { ui, projects, profile } = getContent(loc.lang)
  const seo = ui.seo
  const base = {
    lang: loc.lang,
    path,
    canonical: abs(sectionPath(loc.lang, loc.section, loc.project)),
    alternates: alternatesFor((lang) => sectionPath(lang, loc.section, loc.project)),
    image: abs('/og/cesar-dev.png'),
    imageAlt: seo.ogAlt,
    type: 'website' as const,
    noindex: false,
  }
  if (loc.project) {
    const project = projects.find((p) => p.slug === loc.project)!
    return {
      ...base,
      title: `${project.name}${project.subtitle ? ` · ${project.subtitle}` : ''} — ${seo.suffix}`,
      description: project.mission,
      image: abs(`/og/${project.slug}.png`),
      imageAlt: `${project.name} — ${profile.name}`,
    }
  }
  if (loc.section === 'projects') return { ...base, title: seo.home.title, description: seo.home.description }
  const page = seo[loc.section]
  return { ...base, title: `${page.title} — ${seo.suffix}`, description: page.description, type: loc.section === 'about' ? 'profile' : 'website' }
}

/** Metadatos de cualquier ruta. Rutas inexistentes → página 404 (noindex). */
export function headFor(path: string): Head {
  if (path === '/') {
    // Raíz: redirige al idioma del navegador; su versión canónica es la de español.
    return { ...gameHead({ lang: 'es', section: 'projects' }, path), canonical: abs(sectionPath('es', 'projects')) }
  }
  const [first, second, ...rest] = path.split('/').filter(Boolean)
  if (isLang(first) && second === 'cv' && !rest.length) {
    const { ui } = getContent(first)
    return {
      lang: first,
      path,
      title: `${ui.seo.cv.title} — ${ui.seo.suffix}`,
      description: ui.seo.cv.description,
      canonical: abs(recruiterPath(first)),
      alternates: alternatesFor(recruiterPath),
      image: abs('/og/cesar-dev.png'),
      imageAlt: ui.seo.ogAlt,
      type: 'profile',
      noindex: false,
    }
  }
  const loc = parsePath(path)
  const valid = loc && (!loc.project || getContent(loc.lang).projects.some((p) => p.slug === loc.project))
  if (loc && valid) return gameHead(loc, path)

  const lang: Lang = isLang(first) ? first : 'es'
  const { ui } = getContent(lang)
  return {
    lang,
    path,
    title: ui.seo.notFound.title,
    description: ui.seo.notFound.description,
    canonical: abs(path),
    alternates: [],
    image: abs('/og/cesar-dev.png'),
    imageAlt: ui.seo.ogAlt,
    type: 'website',
    noindex: true,
  }
}

/** Datos estructurados (schema.org Person). */
export function personJsonLd(lang: Lang) {
  const { profile, pockets } = getContent(lang)
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    url: abs(sectionPath(lang, 'projects')),
    email: `mailto:${profile.contact.email}`,
    image: abs('/og/cesar-dev.png'),
    address: { '@type': 'PostalAddress', addressLocality: 'Tijuana', addressRegion: 'B.C.', addressCountry: 'MX' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universidad Autónoma de Baja California (UABC)' },
    knowsAbout: pockets.flatMap((p) => p.items.map((i) => i.label)),
    knowsLanguage: ['es', 'en'],
    sameAs: [profile.contact.github, profile.contact.linkedin].filter(Boolean),
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Etiquetas <head> como HTML, para el prerender. */
export function headTags(head: Head) {
  const other = LANGS.filter((l) => l !== head.lang)
  const tags = [
    `<title>${esc(head.title)}</title>`,
    `<meta name="description" content="${esc(head.description)}" />`,
    head.noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${head.canonical}" />`,
    ...head.alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`),
    `<meta property="og:type" content="${head.type}" />`,
    `<meta property="og:site_name" content="CESAR.DEV" />`,
    `<meta property="og:title" content="${esc(head.title)}" />`,
    `<meta property="og:description" content="${esc(head.description)}" />`,
    `<meta property="og:url" content="${head.canonical}" />`,
    `<meta property="og:image" content="${head.image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(head.imageAlt)}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[head.lang]}" />`,
    ...other.map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}" />`),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(head.title)}" />`,
    `<meta name="twitter:description" content="${esc(head.description)}" />`,
    `<meta name="twitter:image" content="${head.image}" />`,
    `<meta name="twitter:image:alt" content="${esc(head.imageAlt)}" />`,
  ]
  if (!head.noindex) {
    const json = JSON.stringify(personJsonLd(head.lang)).replace(/</g, '\\u003c')
    tags.push(`<script type="application/ld+json">${json}</script>`)
  }
  return tags.join('\n    ')
}

/** Todas las rutas que se prerenderizan (sin la 404). */
export function allPaths() {
  const paths = ['/']
  for (const lang of LANGS) {
    for (const section of SECTIONS) paths.push(sectionPath(lang, section))
    for (const p of getContent(lang).projects) paths.push(sectionPath(lang, 'projects', p.slug))
    paths.push(recruiterPath(lang))
  }
  return paths
}
