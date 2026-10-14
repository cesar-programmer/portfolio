// Prerender: convierte cada ruta en HTML estático con el texto real, sus
// metadatos (title, description, canonical, hreflang, Open Graph, JSON-LD),
// los <link rel="modulepreload"> de sus chunks y su CSS. También genera
// 404.html, sitemap.xml y robots.txt.
//
// Se ejecuta después de `vite build` (cliente) y `vite build --ssr` (servidor).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const serverDir = join(root, 'dist-server')

const { render, headFor, headTags, allPaths, SITE_URL } = await import(pathToFileURL(join(serverDir, 'entry-server.js')).href)
const template = await readFile(join(dist, 'index.html'), 'utf8')
const manifest = JSON.parse(await readFile(join(dist, '.vite', 'manifest.json'), 'utf8'))

// Módulo de cada pantalla (claves del manifest de Vite).
const TAB_MODULE = {
  projects: 'src/screens/ProjectsTab.tsx',
  detail: 'src/screens/ProjectDetail.tsx',
  yo: 'src/screens/AboutTab.tsx',
  about: 'src/screens/AboutTab.tsx',
  skills: 'src/screens/SkillsTab.tsx',
  misiones: 'src/screens/MissionsTab.tsx',
  missions: 'src/screens/MissionsTab.tsx',
  medallas: 'src/screens/BadgesTab.tsx',
  badges: 'src/screens/BadgesTab.tsx',
  contacto: 'src/screens/ContactTab.tsx',
  contact: 'src/screens/ContactTab.tsx',
}

function modulesFor(path) {
  const [, second, third] = path.split('/').filter(Boolean).concat([])
  if (second === 'cv') return ['src/recruiter/RecruiterPage.tsx']
  if (path === '/') return ['src/GameRoute.tsx', TAB_MODULE.projects]
  if (second === 'proyectos' || second === 'projects') return ['src/GameRoute.tsx', third ? TAB_MODULE.detail : TAB_MODULE.projects]
  const tab = TAB_MODULE[second]
  return tab ? ['src/GameRoute.tsx', tab] : ['src/GameRoute.tsx']
}

/** Chunks JS y CSS que necesita una ruta (sus módulos y todo lo que importan). */
function assetsFor(path) {
  const js = new Set()
  const css = new Set()
  const visit = (key) => {
    const entry = manifest[key]
    if (!entry || js.has(entry.file)) return
    js.add(entry.file)
    entry.css?.forEach((file) => css.add(file))
    entry.imports?.forEach(visit)
  }
  modulesFor(path).forEach(visit)
  // Lo que ya carga la entrada no se repite.
  const entry = manifest['index.html']
  js.delete(entry.file)
  entry.imports?.forEach((key) => js.delete(manifest[key]?.file))
  entry.css?.forEach((file) => css.delete(file))
  return { js: [...js], css: [...css] }
}

async function page(path, outFile) {
  const html = await render(path)
  const head = headFor(path)
  const { js, css } = assetsFor(path)
  const links = [
    ...css.map((file) => `<link rel="stylesheet" href="/${file}" />`),
    ...js.map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`),
  ].join('\n    ')
  const out = template
    .replace('<html lang="es"', `<html lang="${head.lang}"`)
    .replace('<!--head-->', `${headTags(head)}\n    ${links}`)
    .replace('<!--app-->', html)
  const file = join(dist, outFile)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, out)
}

const paths = allPaths()
for (const path of paths) {
  await page(path, path === '/' ? 'index.html' : join(path, 'index.html'))
}
await page('/404', '404.html')

// sitemap.xml con alternativas por idioma
const urls = paths
  .filter((p) => p !== '/')
  .map((path) => {
    const head = headFor(path)
    const alternates = head.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`).join('\n')
    return `  <url>\n    <loc>${head.canonical}</loc>\n${alternates}\n  </url>`
  })
  .join('\n')
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
)
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

await rm(serverDir, { recursive: true, force: true })
console.log(`Prerender: ${paths.length} páginas + 404.html, sitemap.xml y robots.txt (${SITE_URL})`)
