import { COLORS, ROWS } from './art/portrait'

// Retrato pixel de Cesar; se escala en múltiplos enteros. Respira en 2 cuadros.

const HEAD_ROWS = 21 // la cabeza respira; el torso queda fijo

function runs(from: number, to: number) {
  const out: { x: number; y: number; w: number; fill: string }[] = []
  for (let y = from; y < to; y++) {
    const row = ROWS[y]
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]
      if (ch === '.') continue
      let w = 1
      while (row[x + w] === ch) w++
      out.push({ x, y, w, fill: COLORS[ch] })
      x += w - 1
    }
  }
  return out
}

const HEAD = runs(0, HEAD_ROWS)
const BODY = runs(HEAD_ROWS, ROWS.length)

export function Portrait({ label, className = '' }: { label: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 30" shapeRendering="crispEdges" className={`portrait ${className}`} role="img" aria-label={label}>
      <g>
        {BODY.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
        ))}
      </g>
      <g className="portrait__head">
        {HEAD.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
        ))}
      </g>
    </svg>
  )
}
