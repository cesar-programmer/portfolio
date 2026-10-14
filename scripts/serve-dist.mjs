// Servidor estático mínimo para dist/ (como un hosting estático: /ruta →
// /ruta/index.html y 404.html para lo que no existe). Lo usan las pruebas.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
}

async function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '')
  for (const candidate of [clean, join(clean, 'index.html')]) {
    const file = join(dist, candidate)
    try {
      if ((await stat(file)).isFile()) return file
    } catch {
      // sigue con la siguiente opción
    }
  }
  return null
}

export function serveDist(port = 4180) {
  const server = createServer(async (req, res) => {
    const file = await resolve(req.url ?? '/')
    const status = file ? 200 : 404
    const path = file ?? join(dist, '404.html')
    res.writeHead(status, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' })
    res.end(await readFile(path))
  })
  return new Promise((ok) => server.listen(port, () => ok(server)))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] ?? 4180)
  await serveDist(port)
  console.log(`dist/ en http://localhost:${port}`)
}
