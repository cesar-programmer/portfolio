// Auditoría de accesibilidad con axe en todas las rutas prerenderizadas,
// en escritorio y en celular. Falla si hay problemas serios o críticos.
// Uso: npm run build && npm run test:a11y
import AxeBuilder from '@axe-core/playwright'
import { chromium } from 'playwright'
import { serveDist } from './serve-dist.mjs'

const PORT = 4181
const server = await serveDist(PORT)
const base = `http://localhost:${PORT}`

const paths = ['/']
for (const [lang, sections, projects] of [
  ['es', ['proyectos', 'yo', 'skills', 'misiones', 'medallas', 'contacto'], 'proyectos'],
  ['en', ['projects', 'about', 'skills', 'missions', 'badges', 'contact'], 'projects'],
]) {
  for (const s of sections) paths.push(`/${lang}/${s}`)
  for (const slug of ['stepable', 'vector-service-api', 'sofonques-explorer', 'finance-chatbot', 'mesa-espejo', 'reportes-docentes', 'koa-caffe', 'antigravity', 'alerta-acv', 'walletg'])
    paths.push(`/${lang}/${projects}/${slug}`)
  paths.push(`/${lang}/cv`)
}
paths.push('/ruta-que-no-existe')

const devices = [
  { name: 'escritorio', viewport: { width: 1440, height: 900 } },
  { name: 'celular', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
]

const browser = await chromium.launch()
const failures = []
let checked = 0
for (const device of devices) {
  const context = await browser.newContext({ ...device, reducedMotion: 'reduce' })
  // Sin globo ni animaciones de primera visita: se audita la página en reposo.
  await context.addInitScript(() => localStorage.setItem('cesardev:seen', JSON.stringify({ boot: true, tip: true, lid: true })))
  const page = await context.newPage()
  for (const path of paths) {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze()
    checked++
    for (const v of violations) {
      if (v.impact !== 'serious' && v.impact !== 'critical') continue
      failures.push(`[${device.name}] ${path} · ${v.impact} · ${v.id}: ${v.help}\n    ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('\n    ')}`)
    }
  }
  await context.close()
}
// Paletas de pantalla y carcasas alternativas (Opciones) en páginas representativas.
const combos = [
  { palette: 'classic', shell: 'indigo' },
  { palette: 'pocket', shell: 'silver' },
  { palette: 'arcade', shell: 'black' },
]
for (const settings of combos) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await context.addInitScript((s) => {
    localStorage.setItem('cesardev:seen', JSON.stringify({ boot: true, tip: true, lid: true }))
    localStorage.setItem('cesardev:settings', JSON.stringify(s))
  }, settings)
  const page = await context.newPage()
  for (const path of ['/es/proyectos', '/es/proyectos/sofonques-explorer', '/es/skills', '/es/medallas', '/es/contacto']) {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze()
    checked++
    for (const v of violations) {
      if (v.impact !== 'serious' && v.impact !== 'critical') continue
      failures.push(`[${settings.palette}/${settings.shell}] ${path} · ${v.impact} · ${v.id}: ${v.help}\n    ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('\n    ')}`)
    }
  }
  await context.close()
}

await browser.close()
server.close()

if (failures.length) {
  console.error(failures.join('\n'))
  console.error(`\n${failures.length} problema(s) serio(s) o crítico(s) en ${checked} páginas.`)
  process.exit(1)
}
console.log(`axe: 0 problemas serios o críticos en ${checked} páginas (${paths.length} rutas × ${devices.length} dispositivos, más 3 combinaciones de paleta y carcasa).`)
