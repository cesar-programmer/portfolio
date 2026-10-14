import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { play } from '../audio/sfx'
import { useControls } from '../console/useControls'
import type { Content, Project } from '../content'
import { sectionPath } from '../routes'
import { useGame } from '../store/game'
import { PixelIcon } from '../ui/PixelIcon'
import { Typewriter } from '../ui/Typewriter'
import { ProjectTags, ProjectVisual, StackChips, Stars } from './projectBits'
import { useScreenScroll } from './ScrollContext'

export function ProjectDetail({ project, content }: { project: Project; content: Content }) {
  const { lang, ui, projects } = content
  const navigate = useNavigate()
  const scroll = useScreenScroll()
  const markVisited = useGame((s) => s.markVisited)
  const setCursor = useGame((s) => s.setProjectCursor)
  const showToast = useGame((s) => s.showToast)

  const i = projects.findIndex((p) => p.slug === project.slug)
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const next = projects[(i + 1) % projects.length]

  // Visitado ✓ y medalla secreta "Explorador" al completar todos.
  useEffect(() => {
    setCursor(project.slug)
    const before = useGame.getState().visited.length
    const after = markVisited(project.slug)
    if (before < projects.length && after.length >= projects.length && projects.every((p) => after.includes(p.slug))) {
      showToast(`${ui.achievements.unlocked} ★ ${content.badges.badges.find((b) => b.secret)?.name ?? ''}`)
      play('achievement')
    }
  }, [project.slug, projects, markVisited, setCursor, showToast, ui, content.badges])

  const go = (p: Project) => {
    play('cursor')
    navigate(sectionPath(lang, 'projects', p.slug))
  }

  return (
    <article className="flex flex-col gap-3 p-3" key={project.slug}>
      <nav className="flex flex-wrap items-center justify-between gap-2" aria-label={project.name}>
        <Link to={sectionPath(lang, 'projects')} className="px-btn" onClick={() => play('cancel')}>
          <PixelIcon name="left" /> {ui.detail.back}
        </Link>
        <div className="flex items-center gap-2">
          <Link to={sectionPath(lang, 'projects', prev.slug)} className="px-btn" onClick={() => play('cursor')} aria-label={`${ui.detail.prev}: ${prev.name}`}>
            <PixelIcon name="left" /> {ui.detail.prev}
          </Link>
          <span className="text-scr-muted text-small">
            {i + 1}/{projects.length}
          </span>
          <Link to={sectionPath(lang, 'projects', next.slug)} className="px-btn" onClick={() => play('cursor')} aria-label={`${ui.detail.next}: ${next.name}`}>
            {ui.detail.next} <PixelIcon name="right" />
          </Link>
        </div>
      </nav>

      <DetailBody key={project.slug} project={project} content={content} onPrev={() => go(prev)} onNext={() => go(next)} onBack={() => navigate(sectionPath(lang, 'projects'))} scroll={scroll} />
    </article>
  )
}

type BodyProps = {
  project: Project
  content: Content
  onPrev: () => void
  onNext: () => void
  onBack: () => void
  scroll: (dy: number) => void
}

function DetailBody({ project, content, onPrev, onNext, onBack, scroll }: BodyProps) {
  const { ui } = content
  const d = ui.detail
  const [complete, setComplete] = useState(false)
  const [missionDone, setMissionDone] = useState(false)
  const onMissionDone = useCallback(() => setMissionDone(true), [])
  const leader = project.slug === 'sofonques-explorer'

  useControls((action) => {
    switch (action) {
      case 'left':
        onPrev()
        return true
      case 'right':
        onNext()
        return true
      case 'up':
        scroll(-80)
        return true
      case 'down':
        scroll(80)
        return true
      case 'a':
        setComplete(true)
        return true
      case 'b':
        play('cancel')
        onBack()
        return true
    }
  })

  const links = project.links
  return (
    <div className="detail-grid">
      <div className="detail-media flex flex-col gap-2">
        <ProjectVisual project={project} ui={ui} toggle />
        {project.medal === 'nasa-2025' && (
          <div className="px-box text-scr-title flex items-center gap-2 p-2">
            <PixelIcon name="badges" />
            <span className="font-pixel text-head">NASA SPACE APPS 2025</span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-3" onClick={() => setComplete(true)}>
        <header>
          <h1 className="scr-title text-title m-0">{project.name}</h1>
          {project.subtitle && <p className="text-scr-accent m-0">{project.subtitle}</p>}
          <p className={leader ? 'scr-title text-head m-0 mt-2 leading-normal' : 'm-0 mt-1'}>
            {!leader && <span className="text-scr-muted">{d.role}: </span>}
            {project.role}
          </p>
          <p className="text-scr-muted m-0 flex flex-wrap items-center gap-3">
            <span>
              {d.year}: {project.year ?? d.yearPending}
            </span>
            <Stars count={project.stars} label={ui.projects.difficulty} />
          </p>
          <div className="mt-2">
            <ProjectTags project={project} ui={ui} />
          </div>
        </header>

        <Section title={d.mission}>
          <Typewriter text={project.mission} complete={complete} onDone={onMissionDone} className="m-0" />
        </Section>

        <Section title={d.whatIDid}>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {project.did.map((item) => (
              <li key={item} className="flex gap-2">
                <PixelIcon name="right" size="sm" className="text-scr-accent mt-[0.4em]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={d.finalBoss}>
          <Typewriter text={project.boss} complete={complete} start={missionDone} className="m-0" />
        </Section>

        <Section title={d.stack}>
          <StackChips project={project} content={content} />
        </Section>

        {(project.fact || project.note) && (
          <div className="px-box text-scr-muted flex flex-col gap-1 p-2">
            {project.fact && <p className="text-scr-accent m-0">{project.fact}</p>}
            {project.note && <p className="m-0">{project.note}</p>}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {links.demo && (
            <a className="px-btn px-btn--primary" href={links.demo} target="_blank" rel="noreferrer">
              {d.viewDemo} ↗
            </a>
          )}
          {links.code && (
            <a className="px-btn" href={links.code} target="_blank" rel="noreferrer">
              {d.viewCode} ↗
            </a>
          )}
          {links.codeFront && (
            <a className="px-btn" href={links.codeFront} target="_blank" rel="noreferrer">
              {d.viewFront} ↗
            </a>
          )}
          {links.caseStudy && (
            <a className="px-btn" href={links.caseStudy} target="_blank" rel="noreferrer">
              {d.caseStudy} ↗
            </a>
          )}
          {project.codePrivate && (
            <span className="px-btn" aria-disabled="true">
              {d.privateCode}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-head text-scr-accent-2 m-0 mb-1 font-pixel">{title.toUpperCase()}</h2>
      {children}
    </section>
  )
}
