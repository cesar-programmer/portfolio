import { createContext, useContext, type RefObject } from 'react'

/** Contenedor con scroll de la pantalla (para mover con ↑ ↓ y volver arriba). */
export const ScrollContext = createContext<RefObject<HTMLDivElement | null> | null>(null)

export function useScreenScroll() {
  const ref = useContext(ScrollContext)
  return (dy: number) => ref?.current?.scrollBy({ top: dy })
}
