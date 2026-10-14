import type { Content, Project } from '../content'
import { PixelIcon } from '../ui/PixelIcon'
import { PixelImage } from '../ui/PixelImage'
import { ProjectArt } from '../ui/ProjectArt'

export function Stars({ count, label }: { count: number; label: string }) {
  return (
    <span className="inline-flex gap-px text-scr-title" role="img" aria-label={`${label}: ${count}/5`}>
      {Array.from({ length: count }, (_, i) => (
        <PixelIcon key={i} name="star" size="sm" />
      ))}
    </span>
  )
}

export function ProjectTags({ project, ui }: { project: Project; ui: Content['ui'] }) {
  const t = ui.tags
  return (
    <span className="flex flex-wrap gap-1.5">
      {project.production && <span className="px-tag px-blink text-scr-accent">{t.production}</span>}
      {project.medal === 'nasa-2025' && <span className="px-tag text-scr-title">{t.nasa}</span>}
      {project.slug === 'mesa-espejo' && <span className="px-tag text-scr-accent">{t.caseStudy}</span>}
      {project.codePrivate && (
        <span className="px-tag text-scr-accent-2">
          <PixelIcon name="lock" size="sm" />
          {t.private}
        </span>
      )}
      {project.bonus && <span className="px-tag text-scr-muted">{t.bonus}</span>}
    </span>
  )
}

export function StackChips({ project, content }: { project: Project; content: Content }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
      {project.stack.map((id) => (
        <li key={id} className="border-scr-line bg-scr-surface-2 text-small border-[length:var(--bw)] px-2 py-0.5 leading-tight">
          {content.techLabel(id)}
        </li>
      ))}
    </ul>
  )
}

/** Captura (con dithering) o ilustración. */
export function ProjectVisual({ project, ui, toggle = false }: { project: Project; ui: Content['ui']; toggle?: boolean }) {
  if (project.image.kind === 'screenshot' && project.image.src) {
    return (
      <PixelImage
        src={project.image.src}
        alt={project.imageAlt}
        toggle={toggle ? { color: ui.detail.viewColor, pixel: ui.detail.viewPixel } : undefined}
      />
    )
  }
  return <ProjectArt project={project} label={ui.detail.illustration} />
}
