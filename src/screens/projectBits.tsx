import type { Content, Project } from '../content'
import { PixelIcon } from '../ui/PixelIcon'
import { PixelImage } from '../ui/PixelImage'
import { ProjectArt } from '../ui/ProjectArt'

export function Stars({ count, label }: { count: number; label: string }) {
  return (
    <span className="inline-flex shrink-0 gap-px text-scr-title" role="img" aria-label={`${label}: ${count}/5`}>
      {Array.from({ length: count }, (_, i) => (
        <PixelIcon key={i} name="star" size="sm" />
      ))}
    </span>
  )
}

/** Hasta dos etiquetas, monocromas. Solo PRIVADO lleva color (rosa). */
export function ProjectTags({ project, ui }: { project: Project; ui: Content['ui'] }) {
  const t = ui.tags
  const tags = [
    project.production && { id: 'production', text: t.production, live: true },
    project.medal === 'nasa-2025' && { id: 'nasa', text: t.nasa },
    project.slug === 'mesa-espejo' && { id: 'case', text: t.caseStudy },
    project.codePrivate && { id: 'private', text: t.private },
    project.bonus && { id: 'bonus', text: t.bonus },
  ]
    .filter((tag): tag is { id: string; text: string; live?: boolean } => !!tag)
    .slice(0, 2)
  if (!tags.length) return null
  return (
    <span className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag.id} className={`px-tag ${tag.id === 'private' ? 'text-scr-accent-2' : 'text-scr-muted'}`}>
          {tag.id === 'private' && <PixelIcon name="lock" size="sm" />}
          {tag.live && <span className="px-tag__dot px-blink" aria-hidden="true" />}
          {tag.text}
        </span>
      ))}
    </span>
  )
}

export function StackChips({ project, content }: { project: Project; content: Content }) {
  return (
    <ul className="stack-chips">
      {project.stack.map((id) => (
        <li key={id}>{content.techLabel(id)}</li>
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
