import { useEffect, useState } from 'react'
import { useGame } from '../store/game'
import { useReducedMotion } from './useReducedMotion'

const CHARS_PER_SECOND = { slow: 30, normal: 70, instant: Infinity }

type Props = {
  text: string
  /** Mostrar el texto completo de inmediato (A, clic, o reduced motion). */
  complete?: boolean
  /** Si es false, el texto espera (queda reservado su espacio). */
  start?: boolean
  onDone?: () => void
  className?: string
}

/**
 * Efecto máquina de escribir. El texto completo existe siempre en el DOM
 * (para lectores de pantalla y para que el alto no salte); solo cambia qué
 * parte es visible. Úsalo con key={texto} para reiniciarlo.
 */
export function Typewriter({ text, complete = false, start = true, onDone, className = '' }: Props) {
  const speed = useGame((s) => s.textSpeed)
  const reduced = useReducedMotion()
  const instant = complete || reduced || speed === 'instant'
  const [shown, setShown] = useState(0)
  const visible = instant ? text.length : shown

  useEffect(() => {
    if (instant || !start || shown >= text.length) return
    const step = Math.max(1, Math.round(CHARS_PER_SECOND[speed] / 30))
    const timer = window.setTimeout(() => setShown((n) => Math.min(text.length, n + step)), 1000 / 30)
    return () => clearTimeout(timer)
  }, [instant, start, shown, text, speed])

  const done = visible >= text.length
  useEffect(() => {
    if (done) onDone?.()
  }, [done, onDone])

  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, visible)}
        <span className="tw-pending">{text.slice(visible)}</span>
      </span>
    </p>
  )
}
