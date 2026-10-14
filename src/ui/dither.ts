// Reduce una imagen a la paleta actual de la pantalla con dithering ordenado
// (Bayer 4×4), como si la mostrara la consola. Se hace en un <canvas> oculto.

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)
// Rampa sobria: solo los tonos neutros de la pantalla.
const TOKENS = ['--scr-bg', '--scr-surface-2', '--scr-line', '--scr-muted', '--scr-ink']

type Rgb = [number, number, number]

function parseHex(hex: string): Rgb | null {
  const m = hex.trim().match(/^#([0-9a-f]{6})$/i)
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const luma = ([r, g, b]: Rgb) => 0.299 * r + 0.587 * g + 0.114 * b

/** Colores de la paleta activa, ordenados de oscuro a claro. */
function currentRamp() {
  const style = getComputedStyle(document.documentElement)
  const seen = new Set<string>()
  const ramp: { rgb: Rgb; l: number }[] = []
  for (const token of TOKENS) {
    const value = style.getPropertyValue(token).trim().toLowerCase()
    const rgb = parseHex(value)
    if (!rgb || seen.has(value)) continue
    seen.add(value)
    ramp.push({ rgb, l: luma(rgb) })
  }
  return ramp.sort((a, b) => a.l - b.l)
}

const cache = new Map<string, Promise<string>>()

export function ditherImage(src: string, width = 240, key = ''): Promise<string> {
  const id = `${src}|${width}|${key}`
  const hit = cache.get(id)
  if (hit) return hit
  const job = new Promise<string>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      const height = Math.round((img.naturalHeight / img.naturalWidth) * width)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return reject(new Error('Sin canvas 2D'))
      ctx.drawImage(img, 0, 0, width, height)
      const data = ctx.getImageData(0, 0, width, height)
      const px = data.data
      const ramp = currentRamp()
      if (ramp.length < 2) return reject(new Error('Paleta inválida'))
      const lo = ramp[0].l
      const hi = ramp[ramp.length - 1].l
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4
          // Luminancia de la imagen estirada al rango de la paleta.
          const l = lo + (luma([px[i], px[i + 1], px[i + 2]]) / 255) * (hi - lo)
          let k = 0
          while (k < ramp.length - 2 && l > ramp[k + 1].l) k++
          const a = ramp[k]
          const b = ramp[k + 1]
          const t = (l - a.l) / Math.max(1, b.l - a.l)
          const c = t > BAYER[(y % 4) * 4 + (x % 4)] ? b.rgb : a.rgb
          px[i] = c[0]
          px[i + 1] = c[1]
          px[i + 2] = c[2]
        }
      }
      ctx.putImageData(data, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`))
    img.src = src
  })
  cache.set(id, job)
  job.catch(() => cache.delete(id))
  return job
}
