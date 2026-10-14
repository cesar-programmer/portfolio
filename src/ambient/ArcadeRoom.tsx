import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../ui/useReducedMotion'
import './room.css'

// Estrellas pixel generadas una sola vez (deterministas) como SVG en mosaico.
function starTile(seed: number, count: number, w: number, h: number) {
  let s = seed
  const rand = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  const colors = ['#ffffff', '#38e8ff', '#ff4fa3', '#ffb000', '#c9bdff']
  let rects = ''
  for (let i = 0; i < count; i++) {
    const size = rand() > 0.85 ? 3 : 2
    const color = colors[Math.floor(rand() * rand() * colors.length)]
    const opacity = (0.35 + rand() * 0.65).toFixed(2)
    rects += `<rect x="${Math.floor(rand() * w)}" y="${Math.floor(rand() * h)}" width="${size}" height="${size}" fill="${color}" opacity="${opacity}"/>`
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" shape-rendering="crispEdges">${rects}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const FAR = starTile(7, 60, 420, 300)
const NEAR = starTile(42, 18, 520, 360)

/**
 * Habitación arcade nocturna detrás de la consola: llena el espacio sobrante
 * en monitores grandes. Parallax sutil con el mouse (sin reduced-motion).
 */
export function ArcadeRoom() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !window.matchMedia('(pointer: fine)').matches) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--mx', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3))
        el.style.setProperty('--my', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduced])

  return (
    <div ref={ref} className="room" aria-hidden="true">
      <div className="room__layer room__stars" style={{ backgroundImage: FAR }} />
      <div className="room__layer room__stars room__stars--near" style={{ backgroundImage: NEAR }} />
      <div className="room__layer room__walls">
        <span className="room__neon room__neon--a">INSERT COIN</span>
        <span className="room__neon room__neon--b">HI-SCORE 999990</span>
        <span className="room__neon room__neon--c">PLAYER 1</span>
        <div className="cabinet cabinet--l1" />
        <div className="cabinet cabinet--l2" />
        <div className="cabinet cabinet--r1" />
        <div className="cabinet cabinet--r2" />
      </div>
      <div className="room__floor" />
    </div>
  )
}
