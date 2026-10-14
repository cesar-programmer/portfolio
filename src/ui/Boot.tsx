import { useEffect } from 'react'
import { play } from '../audio/sfx'
import { useGame } from '../store/game'

/**
 * Encendido: ≤ 1 s, no bloquea (deja pasar clics) y solo en la primera visita.
 * Siempre está en el HTML, pero solo se ve con data-first-boot en <html>, que
 * pone el script del <head> antes del primer pintado.
 */
export function Boot() {
  const markSeen = useGame((s) => s.markSeen)

  useEffect(() => {
    const root = document.documentElement
    if (!('firstBoot' in root.dataset)) return
    markSeen('boot')
    play('power')
    const timer = window.setTimeout(() => delete root.dataset.firstBoot, 950)
    return () => clearTimeout(timer)
  }, [markSeen])

  return (
    <div className="boot" aria-hidden="true">
      <span className="boot__logo scr-title">
        CESAR<span className="text-scr-accent">.DEV</span>
      </span>
    </div>
  )
}
