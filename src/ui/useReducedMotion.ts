import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function useReducedMotion() {
  // En el servidor (prerender) se asume movimiento normal; al hidratar se corrige.
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
}
