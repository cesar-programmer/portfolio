import { useNavigate, useLocation } from 'react-router'
import { Backdrop } from './ambient/Backdrop'
import { play } from './audio/sfx'
import { Console } from './console/Console'
import { useControls } from './console/useControls'
import type { Lang } from './config'
import { getContent } from './content'
import { NotFound } from './NotFound'
import { parsePath, SECTIONS, sectionPath, translatePath, type GameLocation } from './routes'
import { GameScreen } from './screens/GameScreen'
import { useGame } from './store/game'

/** Consola en cualquier ruta del juego; rutas o proyectos inexistentes → GAME OVER (404). */
export default function GameRoute({ path }: { path?: string }) {
  const { pathname } = useLocation()
  const loc = parsePath(path ?? pathname)
  if (!loc) return <NotFound />
  const content = getContent(loc.lang)
  if (loc.project && !content.projects.some((p) => p.slug === loc.project)) return <NotFound />
  return <Game loc={loc} />
}

function Game({ loc }: { loc: GameLocation }) {
  const navigate = useNavigate()
  const content = getContent(loc.lang)

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
      <Backdrop />
      <Console lang={loc.lang}>
        <GameScreen loc={loc} content={content} onLang={switchLang} />
      </Console>
    </>
  )
}
