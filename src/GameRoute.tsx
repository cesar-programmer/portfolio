import { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { ArcadeRoom } from './ambient/ArcadeRoom'
import { play } from './audio/sfx'
import { Console } from './console/Console'
import { useControls } from './console/useControls'
import type { Lang } from './config'
import { getContent } from './content'
import { isLang, parsePath, preferredLang, SECTIONS, sectionPath, translatePath, type GameLocation } from './routes'
import { GameScreen } from './screens/GameScreen'
import { useGame } from './store/game'

export function GameRoute() {
  const { pathname } = useLocation()
  const loc = parsePath(pathname)
  if (!loc) {
    const first = pathname.split('/').filter(Boolean)[0]
    return <Navigate to={sectionPath(isLang(first) ? first : preferredLang(), 'projects')} replace />
  }
  const content = getContent(loc.lang)
  if (loc.project && !content.projects.some((p) => p.slug === loc.project)) {
    return <Navigate to={sectionPath(loc.lang, 'projects')} replace />
  }
  return <Game loc={loc} />
}

function Game({ loc }: { loc: GameLocation }) {
  const navigate = useNavigate()
  const content = getContent(loc.lang)

  useEffect(() => {
    document.documentElement.lang = loc.lang
    document.title = content.ui.meta.title
  }, [loc.lang, content])

  const switchLang = (lang: Lang) => navigate(translatePath(loc, lang), { replace: true })

  // Acciones globales (base de la pila): pestañas, idioma, opciones y Modo TV.
  useControls((action) => {
    const g = useGame.getState()
    switch (action) {
      case 'l':
      case 'r': {
        const i = SECTIONS.indexOf(loc.section)
        const next = SECTIONS[(i + (action === 'r' ? 1 : -1) + SECTIONS.length) % SECTIONS.length]
        play('tab')
        navigate(sectionPath(loc.lang, next))
        return true
      }
      case 'select':
        play('confirm')
        switchLang(loc.lang === 'es' ? 'en' : 'es')
        return true
      case 'start':
        play(g.optionsOpen ? 'cancel' : 'confirm')
        g.setOptionsOpen(!g.optionsOpen)
        return true
      case 'tv':
        g.setTv(!g.tv)
        return true
    }
  })

  return (
    <>
      <ArcadeRoom />
      <Console lang={loc.lang}>
        <GameScreen loc={loc} content={content} onLang={switchLang} />
      </Console>
    </>
  )
}
