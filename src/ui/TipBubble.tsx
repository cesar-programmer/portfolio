import { useEffect } from 'react'
import { useGame } from '../store/game'

/** Globo de ayuda de la primera visita. Se cierra solo o con cualquier interacción. */
export function TipBubble({ text }: { text: string }) {
  const seen = useGame((s) => s.seen.tip)
  const markSeen = useGame((s) => s.markSeen)

  useEffect(() => {
    if (seen) return
    const close = () => markSeen('tip')
    const timer = window.setTimeout(close, 7000)
    // Pequeña espera para no cerrarlo con el mismo clic que cargó la página.
    const arm = window.setTimeout(() => {
      window.addEventListener('pointerdown', close, { once: true })
      window.addEventListener('keydown', close, { once: true })
      window.addEventListener('wheel', close, { once: true })
    }, 300)
    return () => {
      clearTimeout(timer)
      clearTimeout(arm)
      window.removeEventListener('pointerdown', close)
      window.removeEventListener('keydown', close)
      window.removeEventListener('wheel', close)
    }
  }, [seen, markSeen])

  if (seen) return null
  return (
    <div className="tip" role="status">
      {text}
    </div>
  )
}
