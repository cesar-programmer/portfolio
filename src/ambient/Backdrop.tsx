import './backdrop.css'

// Estrellas pixel estáticas, generadas una sola vez (deterministas).
function starTile(seed: number, count: number, w: number, h: number) {
  let s = seed
  const rand = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
  let rects = ''
  for (let i = 0; i < count; i++) {
    const size = rand() > 0.9 ? 2 : 1
    rects += `<rect x="${Math.floor(rand() * w)}" y="${Math.floor(rand() * h)}" width="${size}" height="${size}" fill="#fff" opacity="${(0.3 + rand() * 0.7).toFixed(2)}"/>`
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" shape-rendering="crispEdges">${rects}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const STARS = starTile(11, 26, 360, 280)

/** Fondo sobrio: la consola es la protagonista. */
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__stars" style={{ backgroundImage: STARS }} />
    </div>
  )
}
