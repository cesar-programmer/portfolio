// Ilustraciones pixel art de los proyectos sin captura, dibujadas para el
// portafolio con datos ficticios. Cada una es una lista de rectángulos en una
// cuadrícula de 64 × 40 que usa los tokens de color de la pantalla, así que
// cambian con la paleta (Arcade, Verde clásico, Pocket).

export type Px = [x: number, y: number, w: number, h: number, color: string]

export const W = 64
export const H = 40

const C = {
  bg: 'var(--scr-bg)',
  s1: 'var(--scr-surface)',
  s2: 'var(--scr-surface-2)',
  line: 'var(--scr-line)',
  ink: 'var(--scr-ink)',
  muted: 'var(--scr-muted)',
  amber: 'var(--scr-title)',
  dim: 'var(--scr-title-dim)',
  cyan: 'var(--scr-accent)',
  pink: 'var(--scr-accent-2)',
}

/** Disco pixelado. */
function disc(cx: number, cy: number, r: number, color: string, sy = 1): Px[] {
  const out: Px[] = []
  for (let y = -r; y <= r; y++) {
    const half = Math.floor(Math.sqrt(r * r - y * y) + 0.3)
    if (half <= 0 && Math.abs(y) === r) continue
    out.push([cx - half, Math.round(cy + y * sy), half * 2 + 1, 1, color])
  }
  return out
}

/** Contorno de un rectángulo de 1px. */
function frame(x: number, y: number, w: number, h: number, color: string): Px[] {
  return [
    [x, y, w, 1, color],
    [x, y + h - 1, w, 1, color],
    [x, y, 1, h, color],
    [x + w - 1, y, 1, h, color],
  ]
}

/** Ventana con barra de título. */
function win(x: number, y: number, w: number, h: number): Px[] {
  return [[x, y, w, h, C.s1], ...frame(x, y, w, h, C.line), [x, y, w, 3, C.s2], [x + 2, y + 1, 1, 1, C.muted], [x + 4, y + 1, 1, 1, C.muted]]
}

/** Hoja de documento con esquina doblada y una pestaña de color. */
function doc(x: number, y: number, tab: string): Px[] {
  return [
    [x, y, 8, 10, C.ink],
    [x + 6, y, 2, 2, C.bg],
    [x + 6, y + 1, 1, 1, C.muted],
    [x + 1, y + 3, 5, 1, C.line],
    [x + 1, y + 5, 6, 1, C.line],
    [x + 1, y + 7, 4, 1, C.line],
    [x - 1, y + 2, 3, 3, tab],
  ]
}

function vectorService(): Px[] {
  const p: Px[] = [[0, 0, W, H, C.bg]]
  // Documentos de entrada (PDF, DOCX, URL)
  p.push(...doc(4, 3, C.pink), ...doc(4, 15, C.cyan), ...doc(4, 27, C.amber))
  // Flechas hacia la caja
  for (const y of [8, 20, 32]) p.push([14, y, 6, 1, C.muted], [19, y - 1, 1, 3, C.muted])
  p.push([20, 8, 1, 25, C.muted], [21, 20, 2, 1, C.muted])
  // Caja de procesamiento (chunking + embeddings)
  p.push([23, 12, 15, 16, C.s2], ...frame(23, 12, 15, 16, C.line))
  for (let i = 0; i < 4; i++) p.push([25, 14 + i * 3, 11, 2, i === 1 ? C.amber : C.line])
  // Salida: puntos/vectores
  p.push([38, 20, 4, 1, C.muted], [41, 19, 1, 3, C.muted])
  const dots: [number, number, string][] = [
    [45, 5, C.amber], [49, 3, C.muted], [53, 7, C.amber], [58, 4, C.muted], [47, 10, C.muted],
    [52, 12, C.ink], [56, 10, C.amber], [60, 13, C.muted], [44, 15, C.muted], [50, 16, C.amber], [58, 17, C.muted],
  ]
  for (const [x, y, c] of dots) p.push([x, y, 2, 2, c])
  // Consulta y resultados ordenados
  p.push([43, 23, 19, 4, C.s2], ...frame(43, 23, 19, 4, C.line), [44, 24, 1, 2, C.cyan], [46, 25, 8, 1, C.muted])
  p.push([43, 29, 2, 2, C.amber], [46, 29, 15, 2, C.ink])
  p.push([43, 32, 2, 2, C.dim], [46, 32, 11, 2, C.muted])
  p.push([43, 35, 2, 2, C.line], [46, 35, 7, 2, C.line])
  return p
}

function sofonques(): Px[] {
  const p: Px[] = [[0, 0, W, H, C.bg]]
  const stars = [[3, 4], [12, 33], [27, 3], [36, 36], [5, 22], [30, 30], [40, 6], [61, 37], [58, 2], [20, 37]]
  for (const [x, y] of stars) p.push([x, y, 1, 1, C.muted])
  // Galaxia espiral: dos brazos que se abren desde el núcleo
  const cx = 20
  const cy = 20
  for (let arm = 0; arm < 2; arm++) {
    for (let t = 0; t < 4.6; t += 0.08) {
      const r = 2 + 3.6 * t
      const a = t * 1.15 + arm * Math.PI
      const x = Math.round(cx + r * Math.cos(a))
      const y = Math.round(cy + r * Math.sin(a) * 0.62)
      if (x < 1 || x > 39 || y < 1 || y > 38) continue
      // el brazo se adelgaza hacia afuera
      p.push([x, y, t < 2.6 ? 2 : 1, 1, t < 1.4 ? C.amber : t < 3.2 ? C.ink : C.muted])
    }
  }
  p.push(...disc(cx, cy, 2, C.amber))
  p.push([cx, cy, 1, 1, C.ink])
  // Globo de chat del asistente
  p.push([40, 6, 21, 15, C.s2], ...frame(40, 6, 21, 15, C.line))
  p.push([42, 9, 14, 1, C.ink], [42, 12, 17, 1, C.muted], [42, 15, 11, 1, C.muted])
  p.push([42, 18, 2, 1, C.amber], [45, 18, 2, 1, C.amber], [48, 18, 2, 1, C.amber])
  p.push([38, 19, 3, 2, C.s2], [36, 21, 3, 1, C.line], [38, 20, 1, 1, C.line])
  // Etiqueta de modo (principiante / experto)
  p.push([44, 26, 17, 5, C.s1], ...frame(44, 26, 17, 5, C.line), [46, 28, 6, 1, C.amber], [54, 28, 5, 1, C.muted])
  return p
}

function financeChatbot(): Px[] {
  const p: Px[] = [[0, 0, W, H, C.bg], ...win(3, 3, 42, 34)]
  // Burbujas: usuario (derecha) y bot (izquierda)
  p.push([20, 8, 22, 5, C.s2], [22, 10, 16, 1, C.ink])
  p.push([6, 15, 26, 7, C.bg], ...frame(6, 15, 26, 7, C.line), [8, 17, 20, 1, C.muted], [8, 19, 14, 1, C.muted])
  p.push([24, 24, 18, 4, C.s2], [26, 25, 11, 1, C.ink])
  p.push([6, 30, 36, 4, C.bg], ...frame(6, 30, 36, 4, C.line), [8, 31, 1, 2, C.cyan])
  // Moneda
  p.push(...disc(53, 21, 8, C.dim), ...disc(53, 21, 7, C.amber), ...disc(53, 21, 5, C.dim), ...disc(53, 21, 4, C.amber))
  // Símbolo $
  p.push([52, 17, 3, 1, C.bg], [51, 18, 1, 2, C.bg], [52, 20, 2, 1, C.bg], [54, 21, 1, 2, C.bg], [51, 23, 3, 1, C.bg], [52, 16, 1, 9, C.bg])
  return p
}

function mesaEspejo(): Px[] {
  const p: Px[] = [[0, 0, W, H, C.bg], [3, 3, 40, 34, C.s1], ...frame(3, 3, 40, 34, C.line)]
  // Zonas de calor (datos ficticios)
  const zones: Px[] = [
    [5, 5, 12, 9, C.s2], [17, 5, 9, 7, C.dim], [26, 5, 15, 11, C.s2],
    [5, 14, 9, 12, C.amber], [14, 12, 14, 10, C.dim], [28, 16, 13, 9, C.s2],
    [5, 26, 15, 9, C.s2], [20, 22, 10, 13, C.amber], [30, 25, 11, 10, C.dim],
  ]
  p.push(...zones)
  // Calles
  p.push([3, 13, 40, 1, C.bg], [3, 25, 40, 1, C.bg], [16, 3, 1, 34, C.bg], [29, 3, 1, 34, C.bg])
  // Pines
  for (const [x, y] of [[9, 18], [24, 28], [34, 9]]) p.push([x, y, 3, 3, C.ink], [x + 1, y + 3, 1, 2, C.ink])
  // Semáforos
  for (let i = 0; i < 3; i++) {
    const x = 47 + i * 6
    p.push([x, 6, 5, 15, C.s2], ...frame(x, 6, 5, 15, C.line))
    p.push([x + 1, 8, 3, 3, i === 0 ? C.pink : C.line], [x + 1, 12, 3, 3, i === 1 ? C.amber : C.line], [x + 1, 16, 3, 3, i === 2 ? C.cyan : C.line])
  }
  // Leyenda / indicadores
  p.push([47, 25, 15, 12, C.s1], ...frame(47, 25, 15, 12, C.line))
  p.push([49, 27, 2, 2, C.amber], [52, 28, 8, 1, C.muted], [49, 30, 2, 2, C.dim], [52, 31, 6, 1, C.muted], [49, 33, 2, 2, C.s2], [52, 34, 7, 1, C.muted])
  return p
}

function reportesDocentes(): Px[] {
  const p: Px[] = [[0, 0, W, H, C.bg], ...win(3, 3, 32, 34)]
  // Lista de reportes con estado
  const status = [C.cyan, C.cyan, C.amber, C.line, C.line, C.pink]
  status.forEach((st, i) => {
    const y = 8 + i * 5
    p.push([5, y, 3, 3, C.bg], ...frame(5, y, 3, 3, C.line))
    if (i < 2) p.push([6, y + 1, 1, 1, C.ink])
    p.push([10, y + 1, 14 - (i % 3) * 3, 1, C.ink], [27, y, 6, 3, st === C.line ? C.s2 : st])
  })
  // Calendario
  p.push([39, 3, 22, 26, C.s1], ...frame(39, 3, 22, 26, C.line), [39, 3, 22, 4, C.dim], [42, 1, 1, 3, C.ink], [57, 1, 1, 3, C.ink])
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 6; col++) {
      const x = 41 + col * 3
      const y = 9 + row * 4
      const due = row === 2 && col === 4
      p.push([x, y, 2, 2, due ? C.amber : row === 0 && col < 2 ? C.s2 : C.line])
    }
  // Marca de fecha límite
  p.push(...frame(52, 16, 6, 6, C.amber))
  // Reloj
  p.push(...disc(50, 34, 4, C.ink), ...disc(50, 34, 3, C.s2), [50, 32, 1, 3, C.amber], [50, 34, 2, 1, C.amber])
  p.push([56, 33, 6, 1, C.muted], [56, 35, 4, 1, C.muted])
  return p
}

function koaCaffe(): Px[] {
  const p: Px[] = [[0, 0, W, H, C.bg]]
  // Carta del menú
  p.push([4, 3, 26, 34, C.s1], ...frame(4, 3, 26, 34, C.line), [8, 6, 18, 2, C.amber])
  for (let i = 0; i < 5; i++) {
    const y = 12 + i * 5
    p.push([7, y, 11 - (i % 2) * 3, 1, C.ink], [7, y + 2, 7, 1, C.muted], [24, y, 3, 1, C.dim])
    for (let d = 19; d < 23; d += 2) p.push([d, y, 1, 1, C.line])
  }
  // Taza con vapor
  p.push([35, 22, 12, 10, C.ink], [36, 23, 10, 2, C.muted], [47, 24, 3, 1, C.ink], [49, 25, 1, 3, C.ink], [47, 28, 3, 1, C.ink])
  p.push([33, 32, 16, 2, C.line])
  p.push([38, 15, 1, 2, C.muted], [39, 13, 1, 2, C.muted], [42, 16, 1, 2, C.muted], [43, 14, 1, 2, C.muted])
  // Código QR (patrón ficticio)
  p.push([51, 4, 11, 11, C.ink])
  const finder = (x: number, y: number) => [[x, y, 3, 3, C.bg], [x + 1, y + 1, 1, 1, C.ink]] as Px[]
  p.push(...finder(52, 5), ...finder(58, 5), ...finder(52, 11))
  for (const [x, y] of [[56, 6], [56, 8], [58, 9], [60, 10], [56, 11], [57, 13], [59, 12], [61, 13], [55, 9]]) p.push([x, y, 1, 1, C.bg])
  p.push([51, 17, 11, 1, C.muted], [53, 19, 7, 1, C.muted])
  return p
}

function antigravity(): Px[] {
  const p: Px[] = [[0, 0, W, H, C.bg], [3, 3, 58, 34, C.s1], ...frame(3, 3, 58, 34, C.line)]
  // Rejilla del gráfico
  for (const y of [10, 18, 26]) p.push([5, y, 54, 1, C.bg])
  // Velas (ficticias)
  const candles: [number, number, number, boolean][] = [
    [26, 6, 9, true], [22, 7, 12, true], [20, 5, 14, false], [16, 6, 19, true], [18, 8, 16, false],
    [14, 5, 21, true], [17, 6, 17, false], [21, 9, 12, false], [19, 6, 15, true],
  ]
  candles.forEach(([top, body, low, up], i) => {
    const x = 6 + i * 4
    p.push([x + 1, top - 2, 1, low - top + body + 4, C.muted])
    p.push([x, top, 3, body, up ? C.ink : C.line])
  })
  // Zona bloqueada por noticias (fail-closed)
  p.push([42, 5, 1, 30, C.pink], [42, 5, 1, 1, C.bg], [42, 9, 1, 1, C.bg], [42, 13, 1, 1, C.bg], [42, 17, 1, 1, C.bg], [42, 21, 1, 1, C.bg], [42, 25, 1, 1, C.bg], [42, 29, 1, 1, C.bg])
  // Escudo del Guardián
  const shield: Px[] = []
  for (let y = 0; y < 18; y++) {
    const half = y < 10 ? 8 : Math.max(0, 8 - Math.round((y - 9) * 1.1))
    shield.push([52 - half, 10 + y, half * 2 + 1, 1, C.amber])
  }
  p.push(...shield)
  for (let y = 1; y < 16; y++) {
    const half = y < 10 ? 6 : Math.max(0, 6 - Math.round((y - 9) * 1.1))
    p.push([52 - half, 10 + y, half * 2 + 1, 1, y < 2 ? C.amber : C.dim])
  }
  // Candado dentro del escudo
  p.push([50, 14, 5, 1, C.bg], [50, 14, 1, 3, C.bg], [54, 14, 1, 3, C.bg], [49, 17, 7, 6, C.bg], [52, 19, 1, 2, C.amber])
  return p
}

function alertaAcv(): Px[] {
  const p: Px[] = [[0, 0, W, H, C.bg]]
  // Visor de cámara con esquinas de detección
  const corner = (x: number, y: number, dx: number, dy: number): Px[] => [
    [dx > 0 ? x : x - 4, y, 5, 1, C.cyan],
    [x, dy > 0 ? y : y - 4, 1, 5, C.cyan],
  ]
  p.push(...corner(5, 3, 1, 1), ...corner(36, 3, -1, 1), ...corner(5, 36, 1, -1), ...corner(36, 36, -1, -1))
  // Rostro
  for (let y = -13; y <= 13; y++) {
    const half = Math.round(10 * Math.sqrt(1 - (y * y) / 196))
    p.push([20 - half, 20 + y, half * 2 + 1, 1, C.s2])
  }
  p.push([12, 15, 4, 2, C.ink], [24, 15, 4, 2, C.ink])
  p.push([19, 19, 2, 4, C.line])
  // Boca ligeramente asimétrica
  p.push([15, 27, 4, 1, C.ink], [19, 27, 4, 1, C.ink], [23, 26, 2, 1, C.ink])
  // Puntos de detección
  for (const [x, y] of [[13, 13], [26, 13], [14, 18], [26, 18], [20, 23], [15, 28], [24, 26], [11, 22], [29, 22], [20, 9]]) p.push([x, y, 1, 1, C.amber])
  // Pruebas F·A·S·T
  ;[C.cyan, C.cyan, C.amber].forEach((c, i) => p.push([41, 5 + i * 5, 3, 3, c], [45, 6 + i * 5, 10 - i * 2, 1, C.muted]))
  // Botón de emergencia
  p.push(...disc(51, 29, 8, C.line), ...disc(51, 29, 7, C.pink))
  p.push([50, 25, 3, 9, C.ink], [47, 28, 9, 3, C.ink])
  return p
}

function walletG(): Px[] {
  const p: Px[] = [[0, 0, W, H, C.bg]]
  // Billetera con tarjeta asomando
  p.push([6, 10, 22, 4, C.amber], [8, 11, 6, 1, C.dim])
  p.push([4, 13, 28, 20, C.s2], ...frame(4, 13, 28, 20, C.line), [4, 13, 28, 3, C.line])
  p.push([22, 20, 10, 7, C.s1], ...frame(22, 20, 10, 7, C.line), ...disc(26, 23, 1, C.amber))
  // Gráfica de gastos
  p.push([36, 4, 25, 32, C.s1], ...frame(36, 4, 25, 32, C.line), [38, 31, 21, 1, C.line])
  const bars = [16, 11, 20, 8, 14, 6]
  bars.forEach((h, i) => p.push([39 + i * 3, 31 - h, 2, h, i === 2 ? C.amber : i % 2 ? C.muted : C.dim]))
  p.push([38, 7, 9, 1, C.ink], [38, 9, 6, 1, C.muted])
  return p
}

const ART: Record<string, () => Px[]> = {
  'vector-service-api': vectorService,
  'sofonques-explorer': sofonques,
  'finance-chatbot': financeChatbot,
  'mesa-espejo': mesaEspejo,
  'reportes-docentes': reportesDocentes,
  'koa-caffe': koaCaffe,
  antigravity,
  'alerta-acv': alertaAcv,
  walletg: walletG,
}

const cache = new Map<string, Px[]>()

export function illustrationFor(slug: string): Px[] | null {
  const draw = ART[slug]
  if (!draw) return null
  if (!cache.has(slug)) cache.set(slug, draw())
  return cache.get(slug)!
}
