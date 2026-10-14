import { useEffect, useState } from 'react'

/**
 * Distribución de la consola según el viewport:
 * - horizontal: escritorio y pantallas horizontales.
 * - compact: celular horizontal (alto < 500px).
 * - clamshell: celular y tablet en vertical (concha abierta).
 *
 * Todas las medidas de la carcasa usan la unidad --u (px por unidad de diseño).
 * En tablet y escritorio la consola no pasa del 90% del ancho ni del 88% del alto
 * del viewport; en celular ocupa casi todo, con 8px de margen por lado.
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

const MAX_W = 0.9
const MAX_H = 0.88
const PHONE_MARGIN = 8

// Consola horizontal: 956 × 548 unidades (incluye gatillos), pantalla 576 × 384 (3:2).
export const H = { w: 956, h: 548, screenW: 576, screenH: 384, minU: 0.5, maxU: 2 }
// Horizontal compacta: 880 × 434 unidades.
export const C = { w: 880, h: 434, screenW: 576, screenH: 384 }
// Concha: 400 unidades de ancho. Base con controles 290, bisagra 30, y la tapa
// suma 76 de márgenes, leyenda, logo e identidad alrededor de la pantalla.
export const S = { w: 400, base: 290, hinge: 30, lidV: 76, lidH: 36, maxW: 640 }

function compute(): LayoutState {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const portrait = vh >= vw

  if (vh < 500 && !portrait) {
    const u = Math.min((vw * MAX_W) / C.w, (vh * MAX_H) / C.h)
    return { layout: 'compact', u, screenW: C.screenW * u, screenH: C.screenH * u, width: C.w * u, height: C.h * u, hint: false }
  }

  if (vw < 600 || (vw < 1024 && portrait)) {
    // Celular: casi todo el viewport (8px por lado). Tablet: 90% × 88%.
    const phone = vw < 600
    const height = phone ? vh - PHONE_MARGIN * 2 : vh * MAX_H
    // Ancho máximo para que, con la pantalla al menos en 3:2, todo quepa en el alto.
    const fixedPerWidth = (S.base + S.hinge + S.lidV) / S.w + ((1 - S.lidH / S.w) * 2) / 3
    const width = Math.min(phone ? vw - PHONE_MARGIN * 2 : vw * MAX_W, S.maxW, height / fixedPerWidth)
    const u = width / S.w
    const screenW = width - S.lidH * u
    // La tapa se queda con el alto que no necesitan los controles, hasta ~1:1.3.
    const available = height - (S.base + S.hinge + S.lidV) * u
    const screenH = Math.max(Math.min(available, screenW * 1.3), (screenW * 2) / 3)
    return { layout: 'clamshell', u, screenW, screenH, width, height, hint: false }
  }

  const u = Math.max(H.minU, Math.min((vw * MAX_W) / H.w, (vh * MAX_H) / H.h, H.maxU))
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
