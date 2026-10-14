import { useEffect, useState } from 'react'

/**
 * Distribución de la consola según el viewport:
 * - horizontal: escritorio y pantallas horizontales.
 * - compact: celular horizontal (alto < 500px).
 * - clamshell: celular y tablet en vertical (concha abierta).
 *
 * Todas las medidas de la carcasa usan la unidad --u (px por unidad de diseño).
 */
export type Layout = 'horizontal' | 'compact' | 'clamshell'

export type LayoutState = {
  layout: Layout
  u: number
  /** Tamaño de la pantalla del juego en px CSS. */
  screenW: number
  screenH: number
  /** Ancho y alto totales de la consola en px (solo concha). */
  width: number
  height: number
  hint: boolean
}

// Consola horizontal: 1000 × 536 unidades (incluye gatillos), pantalla 576 × 384 (3:2).
export const H = { w: 1000, h: 536, screenW: 576, screenH: 384, minU: 0.5, maxU: 2 }
// Horizontal compacta: 896 × 404 unidades.
export const C = { w: 896, h: 404, screenW: 576, screenH: 384 }
// Concha: 400 unidades de ancho; la base con controles mide 300 y la bisagra 34.
export const S = { w: 400, base: 300, hinge: 34, lidPad: 10, bezelPad: 8, maxW: 640 }

const HINT_H = 40
const MARGIN = 16

function compute(): LayoutState {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const portrait = vh >= vw

  if (vh < 500 && !portrait) {
    const u = Math.min(vw / C.w, vh / C.h)
    return { layout: 'compact', u, screenW: C.screenW * u, screenH: C.screenH * u, width: C.w * u, height: C.h * u, hint: false }
  }

  if (vw < 600 || (vw < 1024 && portrait)) {
    const width = vw < 600 ? vw : Math.min(vw - MARGIN * 2, S.maxW)
    const height = vw < 600 ? vh : vh - MARGIN * 2
    const u = Math.min(Math.max(width / S.w, 0.75), 1.6)
    const screenW = width - 2 * (S.lidPad + S.bezelPad) * u
    // La tapa se queda con todo el alto que no necesitan los controles, hasta ~1:1.3.
    const available = height - (S.base + S.hinge + 2 * (S.lidPad + S.bezelPad)) * u
    const screenH = Math.max(Math.min(available, screenW * 1.3), (screenW * 2) / 3)
    return { layout: 'clamshell', u, screenW, screenH, width, height, hint: false }
  }

  const fit = Math.min((vw - MARGIN * 2) / H.w, (vh - MARGIN * 2 - HINT_H) / H.h)
  const u = Math.min(Math.max(fit, H.minU), H.maxU)
  return { layout: 'horizontal', u, screenW: H.screenW * u, screenH: H.screenH * u, width: H.w * u, height: H.h * u, hint: true }
}

export function useLayout() {
  const [state, setState] = useState(compute)
  useEffect(() => {
    let frame = 0
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setState(compute()))
    }
    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [])
  return state
}
