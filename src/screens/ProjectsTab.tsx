import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { play } from '../audio/sfx'
import { useControls } from '../console/useControls'
import type { Content, Project, ZoneId } from '../content'
import { recruiterPath, sectionPath } from '../routes'
import { useGame } from '../store/game'
import { PixelIcon, type IconName } from '../ui/PixelIcon'
import { ProjectTags, ProjectVisual, StackChips, Stars } from './projectBits'

const ZONE_ICON: Record<ZoneId, IconName> = { lab: 'ai', city: 'city', workshop: 'systems' }

export function ProjectsTab({ content }: { content: Content }) {
  const { lang, ui, zones, profile } = content
  const navigate = useNavigate()
  const filter = useGame((s) => s.projectFilter)
  const setFilter = useGame((s) => s.setProjectFilter)
  const cursorSlug = useGame((s) => s.projectCursor)
  const setCursor = useGame((s) => s.setProjectCursor)
  const visited = useGame((s) => s.visited)
  const items = useRef(new Map<string, HTMLAnchorElement>())

  const filters: ('all' | ZoneId)[] = ['all', ...zones.map((z) => z.id)]
  const shownZones = filter === 'all' ? zones : zones.filter((z) => z.id === filter)
  const flat = shownZones.flatMap((z) => z.projects)
  const index = Math.max(0, flat.findIndex((p) => p.slug === cursorSlug))
  const current = flat[index]

  const point = (i: number, focus: boolean) => {
    const next = flat[(i + flat.length) % flat.length]
    if (next.slug !== current.slug) play('cursor')
    setCursor(next.slug)
    if (focus) items.current.get(next.slug)?.focus()
  }

  const cycleFilter = (dir: 1 | -1) => {
    const i = filters.indexOf(filter as 'all' | ZoneId)
    setFilter(filters[(i + dir + filters.length) % filters.length])
    play('tab')
  }

  useControls((action) => {
    switch (action) {
      case 'up':
        point(index - 1, true)
        return true
      case 'down':
        point(index + 1, true)
        return true
      case 'left':
        cycleFilter(-1)
        return true
      case 'right':
        cycleFilter(1)
        return true
      case 'a':
        play('confirm')
        navigate(sectionPath(lang, 'projects', current.slug))
        return true
    }
  })

  return (
    <div className="flex flex-col gap-3 p-3">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div>
          <h1 className="scr-title text-title m-0">{profile.shortName}</h1>
          <p className="text-scr-muted m-0">{profile.title}</p>
        </div>
        <Link to={recruiterPath(lang)} className="px-btn px-btn--primary" title={ui.header.recruiterLabel}>
          {ui.header.recruiter}
        </Link>
      </header>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label={ui.projects.filterLabel}>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={`px-btn ${f === filter ? 'px-btn--primary' : ''}`}
            aria-pressed={f === filter}
            onClick={() => {
              setFilter(f)
              play('tab')
            }}
          >
            {f === 'all' ? ui.projects.all : zones.find((z) => z.id === f)!.name.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        <div>
          <nav aria-label={ui.projects.listLabel}>
            {shownZones.map((zone) => (
              <section key={zone.id} className="mb-3">
                <h2 className="text-head text-scr-accent-2 m-0 mb-1 flex items-center gap-2 font-pixel">
                  <PixelIcon name={ZONE_ICON[zone.id]} />
                  {zone.name.toUpperCase()}
                </h2>
                <ul className="m-0 list-none p-0">
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

function ProjectItem({ project, content, selected, visited, itemRef, onPoint }: ItemProps) {
  const { lang, ui } = content
  return (
    <li>
      <Link
        ref={itemRef}
        to={sectionPath(lang, 'projects', project.slug)}
        data-menu-item
        className={`proj-item ${selected ? 'is-selected' : ''}`}
        onPointerEnter={(e) => e.pointerType === 'mouse' && !selected && onPoint()}
        onFocus={() => !selected && onPoint()}
        onClick={() => play('confirm')}
      >
        <PixelIcon name="cursor" className={selected ? 'px-blink text-scr-accent' : 'invisible'} />
        <span className="min-w-0 flex-1">
          <span className="block">{project.name}</span>
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            <Stars count={project.stars} label={ui.projects.difficulty} />
            <ProjectTags project={project} ui={ui} />
          </span>
        </span>
        {visited && <PixelIcon name="check" className="text-scr-accent" label={ui.projects.visited} />}
      </Link>
    </li>
  )
}

function ProjectPreview({ project, content }: { project: Project; content: Content }) {
  const { lang, ui } = content
  return (
    <aside className="projects-preview" aria-live="polite">
      <div className="px-box flex flex-col gap-2 p-3">
        <ProjectVisual project={project} ui={ui} />
        <div>
          <h2 className="scr-title text-title m-0">{project.name}</h2>
          {project.subtitle && <p className="text-scr-accent m-0">{project.subtitle}</p>}
          <p className="text-scr-muted m-0">{project.role}</p>
        </div>
        <ProjectTags project={project} ui={ui} />
        <p className="m-0">{project.mission}</p>
        <StackChips project={project} content={content} />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Link to={sectionPath(lang, 'projects', project.slug)} className="px-btn px-btn--primary" onClick={() => play('confirm')}>
            {project.name} <PixelIcon name="right" />
          </Link>
          <span className="text-small text-scr-muted">{ui.projects.openHint}</span>
        </div>
      </div>
    </aside>
  )
}

function ClassicZone({ content }: { content: Content }) {
  const { ui, classic } = content
  const [open, setOpen] = useState(false)
  return (
    <section className="mt-1">
      <button type="button" className="px-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {ui.projects.classicZone} · {open ? ui.projects.seeLess : ui.projects.seeMore}
      </button>
      {open && (
        <ul className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
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
