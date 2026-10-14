import type { Project } from '../content'
import { H, illustrationFor, W } from './art/illustrations'

/** Ilustración pixel art propia del proyecto (datos ficticios), con la etiqueta "Ilustración". */
export function ProjectArt({ project, label, className = '' }: { project: Project; label: string; className?: string }) {
  const pixels = illustrationFor(project.slug) ?? []
  return (
    <figure className={`relative m-0 ${className}`}>
      <div className="px-box relative overflow-hidden p-0">
        <svg viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" className="block aspect-[8/5] w-full" role="img" aria-label={project.imageAlt}>
          {pixels.map(([x, y, w, h, fill], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
          ))}
        </svg>
      </div>
      <figcaption className="text-scr-muted mt-1">{label}</figcaption>
    </figure>
  )
}
