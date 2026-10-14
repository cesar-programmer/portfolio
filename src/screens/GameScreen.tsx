import { lazy, Suspense, useEffect, useRef } from 'react'
import type { Lang } from '../config'
import type { Content } from '../content'
import type { GameLocation } from '../routes'
import { useGame } from '../store/game'
import { Boot } from '../ui/Boot'
import { TipBubble } from '../ui/TipBubble'
import { Toast } from '../ui/Toast'
import { ScrollContext } from './ScrollContext'
import { Tabs } from './Tabs'

// Una pestaña = un chunk. Después de cargar, el resto se precarga en segundo plano.
const loaders = {
  projects: () => import('./ProjectsTab').then((m) => ({ default: m.ProjectsTab })),
  detail: () => import('./ProjectDetail').then((m) => ({ default: m.ProjectDetail })),
  about: () => import('./AboutTab').then((m) => ({ default: m.AboutTab })),
  skills: () => import('./SkillsTab').then((m) => ({ default: m.SkillsTab })),
  missions: () => import('./MissionsTab').then((m) => ({ default: m.MissionsTab })),
  badges: () => import('./BadgesTab').then((m) => ({ default: m.BadgesTab })),
  contact: () => import('./ContactTab').then((m) => ({ default: m.ContactTab })),
  options: () => import('./Options').then((m) => ({ default: m.Options })),
}
const ProjectsTab = lazy(loaders.projects)
const ProjectDetail = lazy(loaders.detail)
const AboutTab = lazy(loaders.about)
const SkillsTab = lazy(loaders.skills)
const MissionsTab = lazy(loaders.missions)
const BadgesTab = lazy(loaders.badges)
const ContactTab = lazy(loaders.contact)
const Options = lazy(loaders.options)

function usePreloadTabs() {
  useEffect(() => {
    const run = () => Object.values(loaders).forEach((load) => void load())
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(run, 1500)
    return () => clearTimeout(id)
  }, [])
}

type Props = { loc: GameLocation; content: Content; onLang: (lang: Lang) => void }

export function GameScreen({ loc, content, onLang }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const optionsOpen = useGame((s) => s.optionsOpen)
  const project = loc.project ? content.projects.find((p) => p.slug === loc.project) : undefined

  usePreloadTabs()

  // Cada sección y cada ficha empiezan arriba.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [loc.section, loc.project])

  return (
    <ScrollContext.Provider value={scrollRef}>
      <main id="screen" className="scr" tabIndex={-1} aria-label={content.ui.console.screenLabel}>
        <Tabs lang={loc.lang} active={loc.section} ui={content.ui.tabs} />
        <div ref={scrollRef} className="scr-scroll min-h-0 flex-1">
          <Suspense fallback={null}>
            {loc.section === 'projects' &&
              (project ? <ProjectDetail project={project} content={content} /> : <ProjectsTab content={content} />)}
            {loc.section === 'about' && <AboutTab content={content} />}
            {loc.section === 'skills' && <SkillsTab content={content} />}
            {loc.section === 'missions' && <MissionsTab content={content} />}
            {loc.section === 'badges' && <BadgesTab content={content} />}
            {loc.section === 'contact' && <ContactTab content={content} />}
          </Suspense>
        </div>
        <p className="sr-only" aria-live="polite">
          {content.ui.live.section.replace('{name}', project ? project.name : content.ui.tabs[loc.section])}
        </p>
        <Boot />
        <TipBubble text={content.ui.tip} />
        <Toast />
        {optionsOpen && (
          <Suspense fallback={null}>
            <Options content={content} onLang={onLang} />
          </Suspense>
        )}
      </main>
    </ScrollContext.Provider>
  )
}
