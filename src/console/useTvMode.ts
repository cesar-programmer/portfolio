import { useEffect } from 'react'
import { useGame } from '../store/game'

/**
 * Modo TV: la pantalla llena el viewport. Usa la Fullscreen API si existe y
 * sincroniza el estado cuando el navegador sale de pantalla completa (Esc).
 */
export function useTvMode() {
  const tv = useGame((s) => s.tv)
  const setTv = useGame((s) => s.setTv)

  useEffect(() => {
    const root = document.documentElement
    if (tv) {
      root.dataset.tv = ''
      if (document.fullscreenEnabled && !document.fullscreenElement) {
        root.requestFullscreen?.().catch(() => {})
      }
    } else {
      delete root.dataset.tv
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    }
  }, [tv])

  useEffect(() => {
    if (!tv) return
    // Esc sale del Modo TV antes de que cualquier pantalla lo use como "regresar".
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      e.stopImmediatePropagation()
      setTv(false)
    }
    let wasFullscreen = !!document.fullscreenElement
    const onFullscreen = () => {
      if (document.fullscreenElement) wasFullscreen = true
      else if (wasFullscreen) setTv(false)
    }
    window.addEventListener('keydown', onKey, true)
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      document.removeEventListener('fullscreenchange', onFullscreen)
    }
  }, [tv, setTv])
}
