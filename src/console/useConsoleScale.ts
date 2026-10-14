import { useEffect, useState } from 'react'

// Medidas de la carcasa de escritorio en píxeles lógicos (1 = un píxel de la pantalla).
export const SHELL_W = 224
export const SHELL_H = 314
const HINT_SPACE = 64
const MOBILE_SCREEN_W = 182 // pantalla + bisel en celular
const MOBILE_SCREEN_H = 172 + 30 // bisel + logo

export type Layout = 'desktop' | 'mobile'

function compute(): { px: number; layout: Layout } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const mobile = vw < 600 || (vw < 900 && vh > vw && matchMedia('(pointer: coarse)').matches)

  if (mobile) {
    // Celular: la carcasa ocupa toda la pantalla. La pantalla llena el ancho
    // y deja al menos ~42% del alto para los controles táctiles.
    const px = Math.min(vw / MOBILE_SCREEN_W, (vh * 0.58) / MOBILE_SCREEN_H)
    return { px: Math.max(1, px), layout: 'mobile' }
  }

  const fit = Math.min((vw - 32) / SHELL_W, (vh - HINT_SPACE) / SHELL_H)
  // Múltiplos enteros cuando se puede; si no, medios píxeles (el texto de 8
  // píxeles lógicos sigue cayendo en píxeles enteros).
  const px = fit >= 3 ? Math.floor(fit) : Math.floor(fit * 2) / 2
  return { px: Math.max(1, px), layout: 'desktop' }
}

export function useConsoleScale() {
  const [state, setState] = useState(compute)
  useEffect(() => {
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setState(compute()))
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return state
}
