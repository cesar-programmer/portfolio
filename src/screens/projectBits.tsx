import { useState } from 'react'
import type { Content, Project } from '../content'
import { PixelIcon } from '../ui/PixelIcon'
import { PixelImage } from '../ui/PixelImage'
import { ProjectArt } from '../ui/ProjectArt'

/** Estrellas de dificultad. Con showLabel se lee "Dificultad ★★★★". */
export function Stars({ count, label, showLabel = false }: { count: number; label: string; showLabel?: boolean }) {
  const stars = (
    <span className="inline-flex shrink-0 gap-px text-scr-title" role="img" aria-label={`${label}: ${count}/5`}>
      {Array.from({ length: count }, (_, i) => (
        <PixelIcon key={i} name="star" size="sm" />
      ))}
    </span>
  )
  if (!showLabel) return stars
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-scr-muted" aria-hidden="true">
        {label}
      </span>
      {stars}
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

/** Stack del proyecto. Con limit muestra los primeros N y luego "+M". */
export function StackChips({ project, content, limit }: { project: Project; content: Content; limit?: number }) {
  const shown = limit ? project.stack.slice(0, limit) : project.stack
  const rest = project.stack.length - shown.length
  return (
    <ul className="stack-chips">
      {shown.map((id) => (
        <li key={id}>{content.techLabel(id)}</li>
      ))}
      {rest > 0 && (
        <li className="stack-chips__more" title={project.stack.slice(shown.length).map(content.techLabel).join(', ')}>
          +{rest}
        </li>
      )}
    </ul>
  )
}

/**
 * Captura real (con dithering ⇄ color) o ilustración. En la ficha (detail),
 * si hay varias capturas se pueden recorrer con miniaturas numeradas.
 */
export function ProjectVisual({ project, ui, detail = false }: { project: Project; ui: Content['ui']; detail?: boolean }) {
  const [index, setIndex] = useState(0)
  const { image } = project
  if (image.kind !== 'screenshot' || !image.src) return <ProjectArt project={project} label={ui.detail.illustration} />

  const shots = detail ? [image.src, ...image.gallery] : [image.src]
  const alts = [project.imageAlt, ...(project.galleryAlt ?? [])]
  return (
    <div className="flex flex-col gap-2">
      <PixelImage
        key={shots[index]}
        src={shots[index]}
        alt={alts[index] ?? project.imageAlt}
        toggle={detail ? { color: ui.detail.viewColor, pixel: ui.detail.viewPixel } : undefined}
      />
      {shots.length > 1 && (
        <div className="flex gap-2" role="group" aria-label={ui.detail.screenshots}>
          {shots.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`px-btn ${i === index ? 'px-btn--current' : ''}`}
              aria-pressed={i === index}
              aria-label={alts[i]}
              onClick={() => setIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
