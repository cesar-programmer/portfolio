import type { Project } from '../content'

// Ilustración pixel genérica para proyectos sin captura: una "ventana" con
// datos ficticios (barras, filas, gráfica). Determinista por proyecto.

function seeded(slug: string) {
  let h = 2166136261
  for (const c of slug) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

const W = 64
const H = 40

export function ProjectArt({ project, label, className = '' }: { project: Project; label: string; className?: string }) {
  const rand = seeded(project.slug)
  const bars = Array.from({ length: 7 }, () => 4 + Math.floor(rand() * 12))
  const rows = Array.from({ length: 4 }, () => 8 + Math.floor(rand() * 16))
  const accent = project.zone === 'lab' ? 'var(--scr-accent)' : project.zone === 'city' ? 'var(--scr-title)' : 'var(--scr-accent-2)'

  return (
    <figure className={`relative m-0 ${className}`}>
      <div className="px-box relative overflow-hidden p-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          shapeRendering="crispEdges"
          className="block aspect-[8/5] w-full"
          role="img"
          aria-label={project.imageAlt}
        >
          <rect width={W} height={H} fill="var(--scr-surface)" />
          {/* ventana */}
          <rect x="3" y="3" width={W - 6} height={H - 6} fill="var(--scr-bg)" />
          <rect x="3" y="3" width={W - 6} height="4" fill="var(--scr-surface-2)" />
          <rect x="5" y="4" width="2" height="2" fill="var(--scr-accent-2)" />
          <rect x="8" y="4" width="2" height="2" fill="var(--scr-title)" />
          <rect x="11" y="4" width="2" height="2" fill="var(--scr-accent)" />
          {/* barra lateral */}
          <rect x="3" y="7" width="10" height={H - 10} fill="var(--scr-surface)" />
          {[10, 14, 18, 22].map((y, i) => (
            <rect key={y} x="5" y={y} width={i === 0 ? 6 : 5} height="2" fill={i === 0 ? accent : 'var(--scr-line)'} />
          ))}
          {/* tarjetas tipo indicador */}
          {[16, 29, 42].map((x, i) => (
            <g key={x}>
              <rect x={x} y="10" width="11" height="7" fill="var(--scr-surface-2)" />
              <rect x={x + 2} y="12" width="3" height="3" fill={i === 1 ? 'var(--scr-accent-2)' : accent} />
              <rect x={x + 6} y="12" width="3" height="1" fill="var(--scr-muted)" />
              <rect x={x + 6} y="14" width="2" height="1" fill="var(--scr-line)" />
            </g>
          ))}
          {/* gráfica */}
          {bars.map((h, i) => (
            <rect key={i} x={16 + i * 3} y={34 - h} width="2" height={h} fill={i % 3 === 0 ? 'var(--scr-title)' : accent} />
          ))}
          {/* filas de tabla */}
          {rows.map((w, i) => (
            <g key={i}>
              <rect x="38" y={21 + i * 3} width="2" height="2" fill={i % 2 ? 'var(--scr-accent-2)' : accent} />
              <rect x="41" y={21.5 + i * 3} width={Math.min(w, 17)} height="1" fill="var(--scr-muted)" />
            </g>
          ))}
        </svg>
        <span className="px-tag absolute top-2 right-2 bg-scr-bg text-scr-muted">{label}</span>
      </div>
    </figure>
  )
}
