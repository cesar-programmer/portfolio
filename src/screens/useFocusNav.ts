import type { RefObject } from 'react'
import { play } from '../audio/sfx'
import { useControls } from '../console/useControls'
import { useScreenScroll } from './ScrollContext'

/**
 * ↑ ↓ recorren los elementos marcados con data-nav dentro de la sección (el
 * foco hace scroll solo) y A activa el que tiene el foco. Si no hay más
 * elementos en esa dirección, ↑ ↓ desplazan el contenido.
 */
export function useFocusNav(ref: RefObject<HTMLElement | null>) {
  const scroll = useScreenScroll()
  useControls((action) => {
    const root = ref.current
    if (!root) return false
    if (action === 'up' || action === 'down') {
      const items = [...root.querySelectorAll<HTMLElement>('[data-nav]')]
      const dir = action === 'down' ? 1 : -1
      const current = items.indexOf(document.activeElement as HTMLElement)
      const next = current < 0 ? (dir > 0 ? 0 : items.length - 1) : current + dir
      if (next < 0 || next >= items.length) {
        scroll(dir * 80)
        return true
      }
      items[next].focus()
      play('cursor')
      return true
    }
    if (action === 'a') {
      const el = document.activeElement as HTMLElement | null
      if (el && root.contains(el)) {
        el.click()
        return true
      }
    }
    return false
  })
}
