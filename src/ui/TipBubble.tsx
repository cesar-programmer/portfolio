import { useEffect } from 'react'
import { useGame } from '../store/game'

/**
 * Globo de ayuda de la primera visita. Se cierra solo o con cualquier
 * interacción. Se ve solo con data-first-tip en <html> (script del <head>).
 */
export function TipBubble({ text }: { text: string }) {
  const markSeen = useGame((s) => s.markSeen)

  useEffect(() => {
    const root = document.documentElement
    if (!('firstTip' in root.dataset)) return
    const close = () => {
      delete root.dataset.firstTip
      markSeen('tip')
    }
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
  }, [markSeen])

  return (
    <div className="tip" role="status">
      {text}
    </div>
  )
}
