// Genera las imágenes de vista previa (Open Graph / Twitter, 1200 × 630) al
// estilo de la consola: una general y una por proyecto, en public/og/.
// Uso: npm run og   (requiere `npx playwright install chromium` una vez)
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import { illustrationFor, W, H } from '../src/ui/art/illustrations.ts'
import { COLORS, ROWS } from '../src/ui/art/portrait.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = async (p) => JSON.parse(await readFile(join(root, p), 'utf8'))
const shared = await read('src/content/shared/projects.json')
const es = await read('src/content/es/projects.json')
const en = await read('src/content/en/projects.json')
const tech = (await read('src/content/shared/skills.json')).tech
const outDir = join(root, 'public', 'og')
await mkdir(outDir, { recursive: true })

const font = (file) => pathToFileURL(join(root, 'public', 'fonts', file)).href
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

// Paleta "Arcade" de la pantalla (la misma de src/index.css).
const TOKENS = `
  --scr-bg:#15102a; --scr-surface:#1c1634; --scr-surface-2:#29214a; --scr-line:#3a3060;
  --scr-ink:#ece8f6; --scr-muted:#a79fc2; --scr-title:#ffb000; --scr-title-dim:#c9922f;
  --scr-accent:#38e8ff; --scr-accent-2:#ff4fa3; --scr-skin:#b27a4e; --scr-skin-lo:#8a5733;
  --scr-hair:#2b1d17; --scr-glass:#0d0a16; --scr-lens:#d8e4f0; --scr-hoodie:#5a4aa0; --scr-hoodie-lo:#463a80;`

function artSvg(slug) {
  const rects = illustrationFor(slug)
    .map(([x, y, w, h, fill]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`)
    .join('')
  return `<svg viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" class="art">${rects}</svg>`
}

function portraitSvg() {
  let rects = ''
  ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === '.') continue
      let w = 1
      while (row[x + w] === row[x]) w++
      rects += `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${COLORS[row[x]]}"/>`
      x += w - 1
    }
  })
  return `<svg viewBox="0 0 24 30" shape-rendering="crispEdges" class="portrait">${rects}</svg>`
}

function html({ screen, title, sub, chips, stars }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Press Start 2P'; src: url(${font('press-start-2p-latin.woff2')}); }
  @font-face { font-family: 'Pixelify Sans'; src: url(${font('pixelify-sans-latin.woff2')}); font-weight: 400 700; }
  :root { ${TOKENS} }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; overflow: hidden;
    background: radial-gradient(ellipse 60% 60% at 50% 50%, #241a40, #0e0c14 75%); display: grid; place-items: center;
    font-family: system-ui, sans-serif; }
  .console { width: 1120px; height: 560px; border-radius: 48px 48px 120px 48px; padding: 36px; display: flex; gap: 36px;
    background: radial-gradient(120% 80% at 30% 0%, rgb(255 255 255 / .2), transparent 60%), linear-gradient(180deg, #e3e0d8, #cbc8c0 25%, #cbc8c0 70%, #a9a69d);
    box-shadow: inset 0 3px 0 rgb(255 255 255 / .4), inset 0 -6px 4px #a9a69d, 0 24px 48px rgb(0 0 0 / .6); }
  .bezel { position: relative; flex: none; width: 640px; padding: 40px 32px 32px 48px; border-radius: 18px 18px 64px 18px;
    background: linear-gradient(180deg, #50545f, #3c3f48); box-shadow: inset 0 -3px 4px rgb(0 0 0 / .3); }
  .label { position: absolute; left: 48px; right: 32px; top: 14px; display: flex; align-items: center; gap: 10px;
    color: #b4b8c3; font: 700 11px system-ui; letter-spacing: .14em; }
  .label::before, .label::after { content: ''; flex: 1; height: 3px; background: linear-gradient(#9a2453 0 50%, #2f3a8a 50%); }
  .led { position: absolute; left: 16px; top: 190px; width: 12px; height: 12px; border-radius: 50%; background: #e2312f; box-shadow: 0 0 10px #ff4d3d; }
  .screen { width: 560px; height: 420px; background: var(--scr-bg); display: grid; place-items: center; overflow: hidden; }
  .art { width: 560px; height: 350px; image-rendering: pixelated; }
  .shot { width: 560px; height: 350px; object-fit: cover; object-position: top; }
  .portrait { width: 192px; height: 240px; }
  .hello { display: flex; flex-direction: column; align-items: center; gap: 24px; }
  .hello span { font-family: 'Press Start 2P'; font-size: 26px; color: var(--scr-title); text-shadow: 3px 3px 0 #4a2c00; }
  .info { display: flex; flex-direction: column; justify-content: center; gap: 18px; min-width: 0; color: #2f3a8a; }
  .brand { font-family: 'Press Start 2P'; font-style: italic; font-size: 30px; }
  .brand span { opacity: .75; }
  h1 { font-family: 'Press Start 2P'; font-size: ${title.length > 18 ? 22 : 28}px; line-height: 1.45; color: #1d2563; }
  .sub { font: 700 20px system-ui; color: #2f3a8a; }
  .stars { font-size: 26px; color: #b07a00; letter-spacing: 4px; }
  ul { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; list-style: none; }
  li { padding: 6px 12px; border-radius: 14px; background: #6d6f78; color: #fff; font: 700 15px system-ui; }
  .tag { font: 800 13px system-ui; letter-spacing: .08em; color: #2f3a8a; white-space: nowrap; }
  </style></head><body><div class="console">
    <div class="bezel"><div class="label">PIXEL SCREEN · 32K COLORS</div><div class="led"></div><div class="screen">${screen}</div></div>
    <div class="info">
      <div class="brand">CESAR<span>.DEV</span></div>
      <h1>${esc(title)}</h1>
      ${sub ? `<p class="sub">${esc(sub)}</p>` : ''}
      ${stars ? `<p class="stars">${'★'.repeat(stars)}</p>` : ''}
      <ul>${chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      <p class="tag">CESAR CORDOVA · AI &amp; BACKEND DEVELOPER</p>
    </div>
  </div></body></html>`
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })

// La página se abre como archivo local para que pueda cargar fuentes e imágenes de public/.
const tmp = join(tmpdir(), 'cesar-dev-og.html')
async function shoot(name, data) {
  await writeFile(tmp, html(data))
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(outDir, `${name}.png`) })
}

await shoot('cesar-dev', {
  screen: `<div class="hello">${portraitSvg()}<span>CESAR CORDOVA</span></div>`,
  title: 'AI & Backend Developer',
  sub: 'Python · JS · Tijuana, B.C.',
  chips: ['Python', 'FastAPI', 'LangGraph', 'RAG', 'Node.js', 'PostgreSQL'],
})

for (const p of shared.projects) {
  const subEs = es.projects[p.slug].subtitle
  const subEn = en.projects[p.slug].subtitle
  const screen =
    p.image.kind === 'screenshot'
      ? `<img class="shot" src="${pathToFileURL(join(root, 'public', p.image.src)).href}">`
      : artSvg(p.slug)
  await shoot(p.slug, {
    screen,
    title: es.projects[p.slug].name,
    // Solo subtítulos que no cambian con el idioma (la imagen es la misma en ES y EN).
    sub: subEs && subEs === subEn ? subEs : '',
    stars: p.stars,
    chips: p.stack.slice(0, 5).map((id) => tech[id] ?? id),
  })
}

await browser.close()
await rm(tmp, { force: true })
console.log(`Imágenes OG en public/og/ (${shared.projects.length + 1})`)
