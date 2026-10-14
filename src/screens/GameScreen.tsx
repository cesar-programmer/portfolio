import { useEffect, useRef } from 'react'
import type { Lang } from '../config'
import type { Content } from '../content'
import type { GameLocation } from '../routes'
import { useGame } from '../store/game'
import { Boot } from '../ui/Boot'
import { TipBubble } from '../ui/TipBubble'
import { Toast } from '../ui/Toast'
import { Options } from './Options'
import { AboutTab } from './AboutTab'
import { BadgesTab } from './BadgesTab'
import { ContactTab } from './ContactTab'
import { MissionsTab } from './MissionsTab'
import { SkillsTab } from './SkillsTab'
import { ProjectDetail } from './ProjectDetail'
import { ProjectsTab } from './ProjectsTab'
import { ScrollContext } from './ScrollContext'
import { Tabs } from './Tabs'

type Props = { loc: GameLocation; content: Content; onLang: (lang: Lang) => void }

export function GameScreen({ loc, content, onLang }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const optionsOpen = useGame((s) => s.optionsOpen)
  const project = loc.project ? content.projects.find((p) => p.slug === loc.project) : undefined

  // Cada sección y cada ficha empiezan arriba.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [loc.section, loc.project])

  return (
    <ScrollContext.Provider value={scrollRef}>
      <main id="screen" className="scr" tabIndex={-1} aria-label={content.ui.console.screenLabel}>
        <Tabs lang={loc.lang} active={loc.section} ui={content.ui.tabs} />
        <div ref={scrollRef} className="scr-scroll min-h-0 flex-1">
          {loc.section === 'projects' &&
            (project ? <ProjectDetail project={project} content={content} /> : <ProjectsTab content={content} />)}
          {loc.section === 'about' && <AboutTab content={content} />}
          {loc.section === 'skills' && <SkillsTab content={content} />}
          {loc.section === 'missions' && <MissionsTab content={content} />}
          {loc.section === 'badges' && <BadgesTab content={content} />}
          {loc.section === 'contact' && <ContactTab content={content} />}
        </div>
        <Boot />
        <TipBubble text={content.ui.tip} />
        <Toast />
        {optionsOpen && <Options content={content} onLang={onLang} />}
      </main>
    </ScrollContext.Provider>
  )
}
