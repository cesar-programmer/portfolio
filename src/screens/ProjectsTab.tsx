import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { play } from '../audio/sfx'
import { useControls } from '../console/useControls'
import type { Content, Project, ZoneId } from '../content'
import { sectionPath } from '../routes'
import { useGame } from '../store/game'
import { PixelIcon, type IconName } from '../ui/PixelIcon'
import { ProjectTags, ProjectVisual, StackChips, Stars } from './projectBits'

const ZONE_ICON: Record<ZoneId, IconName> = { lab: 'ai', city: 'city', workshop: 'systems' }

export function ProjectsTab({ content }: { content: Content }) {
  const { lang, ui, zones } = content
  const navigate = useNavigate()
  const cursorSlug = useGame((s) => s.projectCursor)
  const setCursor = useGame((s) => s.setProjectCursor)
  const visited = useGame((s) => s.visited)
  const items = useRef(new Map<string, HTMLAnchorElement>())

  const flat = zones.flatMap((z) => z.projects)
  const index = Math.max(0, flat.findIndex((p) => p.slug === cursorSlug))
  const current = flat[index]

  const point = (slug: string, focus: boolean) => {
    if (slug !== current.slug) play('cursor')
    setCursor(slug)
    if (focus) items.current.get(slug)?.focus()
  }

  // ← → saltan al primer proyecto del mundo anterior o siguiente.
  const jumpZone = (dir: 1 | -1) => {
    const z = zones.findIndex((zone) => zone.id === current.zone)
    const target = zones[(z + dir + zones.length) % zones.length]
    point(target.projects[0].slug, true)
  }

  useControls((action) => {
    switch (action) {
      case 'up':
        point(flat[(index - 1 + flat.length) % flat.length].slug, true)
        return true
      case 'down':
        point(flat[(index + 1) % flat.length].slug, true)
        return true
      case 'left':
        jumpZone(-1)
        return true
      case 'right':
        jumpZone(1)
        return true
      case 'a':
        play('confirm')
        navigate(sectionPath(lang, 'projects', current.slug))
        return true
    }
  })

  return (
    <div className="projects-grid p-4">
      <div>
        <nav aria-label={ui.projects.listLabel} className="flex flex-col gap-5">
          {zones.map((zone) => (
            <section key={zone.id}>
              <h2 className="zone-head">
                <PixelIcon name={ZONE_ICON[zone.id]} size="sm" />
                {zone.name.toUpperCase()}
              </h2>
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {zone.projects.map((p) => (
                  <ProjectItem
                    key={p.slug}
                    project={p}
                    content={content}
                    selected={p.slug === current.slug}
                    visited={visited.includes(p.slug)}
                    itemRef={(el) => {
                      if (el) items.current.set(p.slug, el)
                      else items.current.delete(p.slug)
                    }}
                    onPoint={() => setCursor(p.slug)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </nav>
        <ClassicZone content={content} />
      </div>
      <ProjectPreview project={current} content={content} />
    </div>
  )
}

type ItemProps = {
  project: Project
  content: Content
  selected: boolean
  visited: boolean
  itemRef: (el: HTMLAnchorElement | null) => void
  onPoint: () => void
}

/** Fila de la lista: solo nombre, estrellas y ✓ si ya se visitó. */
function ProjectItem({ project, content, selected, visited, itemRef, onPoint }: ItemProps) {
  const { lang, ui } = content
  return (
    <li>
      <Link
        ref={itemRef}
        to={sectionPath(lang, 'projects', project.slug)}
        data-menu-item
        aria-current={selected ? 'true' : undefined}
        className="proj-item"
        onPointerEnter={(e) => e.pointerType === 'mouse' && !selected && onPoint()}
        onFocus={() => !selected && onPoint()}
        onClick={() => play('confirm')}
      >
        <PixelIcon name="cursor" className={selected ? 'px-blink text-scr-title' : 'invisible'} />
        <span className="min-w-0 flex-1">{project.name}</span>
        {visited && <PixelIcon name="check" size="sm" className="text-scr-muted" label={ui.projects.visited} />}
        <Stars count={project.stars} label={ui.projects.difficulty} />
      </Link>
    </li>
  )
}

function ProjectPreview({ project, content }: { project: Project; content: Content }) {
  const { lang, ui } = content
  return (
    <aside className="projects-preview" aria-live="polite">
      <div className="px-box flex flex-col gap-4 p-4">
        <ProjectVisual project={project} ui={ui} />
        <div className="flex flex-col gap-1">
          <h2 className="scr-title text-title m-0">{project.name}</h2>
          {project.subtitle && <p className="m-0">{project.subtitle}</p>}
          <p className="text-scr-muted m-0">{project.role}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Stars count={project.stars} label={ui.projects.difficulty} showLabel />
          <ProjectTags project={project} ui={ui} />
        </div>
        <p className="m-0">{project.mission}</p>
        <StackChips project={project} content={content} limit={5} />
        <div className="flex flex-wrap items-center gap-3">
          <Link to={sectionPath(lang, 'projects', project.slug)} className="px-btn px-btn--primary" onClick={() => play('confirm')}>
            {project.name} <PixelIcon name="right" size="sm" />
          </Link>
          <span className="text-scr-muted">{ui.projects.openHint}</span>
        </div>
      </div>
    </aside>
  )
}

function ClassicZone({ content }: { content: Content }) {
  const { ui, classic } = content
  const [open, setOpen] = useState(false)
  return (
    <section className="mt-5">
      <button type="button" className="zone-head zone-head--button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <PixelIcon name={open ? 'down' : 'right'} size="sm" />
        {ui.projects.classicZone.toUpperCase()} · {open ? ui.projects.seeLess : ui.projects.seeMore}
      </button>
      {open && (
        <ul className="m-0 mt-2 flex list-none flex-col gap-2 p-0">
          {classic.map((c) => (
            <li key={c.id}>
              <a href={c.url} target="_blank" rel="noreferrer" className="text-scr-accent underline underline-offset-4">
                {c.name}
              </a>{' '}
              <span className="text-scr-muted">— {c.description}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
