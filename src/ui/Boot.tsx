import { useEffect, useState } from 'react'
import { play } from '../audio/sfx'
import { useGame } from '../store/game'
import { useReducedMotion } from './useReducedMotion'

/** Encendido: ≤ 1 s, no bloquea (deja pasar clics) y solo en la primera visita. */
export function Boot() {
  const seenBoot = useGame((s) => s.seen.boot)
  const markSeen = useGame((s) => s.markSeen)
  const reduced = useReducedMotion()
  const [show, setShow] = useState(!seenBoot && !reduced)

  useEffect(() => {
    markSeen('boot')
    if (!show) return
    play('power')
    const timer = window.setTimeout(() => setShow(false), 950)
    return () => clearTimeout(timer)
  }, [show, markSeen])

  if (!show) return null
  return (
    <div className="boot" aria-hidden="true">
      <span className="boot__logo scr-title">
        CESAR<span className="text-scr-accent">.DEV</span>
      </span>
    </div>
  )
}
