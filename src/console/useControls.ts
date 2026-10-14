import { useEffect, useRef, useState } from 'react'
import { onPress, pushHandler, type Action, type Handler } from './input'

/** Suscribe la pantalla actual a las acciones del control. */
export function useControls(handler: Handler, enabled = true) {
  const ref = useRef(handler)
  useEffect(() => {
    ref.current = handler
  })
  useEffect(() => {
    if (!enabled) return
    return pushHandler((action) => ref.current(action))
  }, [enabled])
}

/** true mientras la acción está presionada (teclado, clic o toque). */
export function usePressed(action: Action) {
  const [pressed, setPressed] = useState(false)
  useEffect(
    () =>
      onPress((a, down) => {
        if (a === action) setPressed(down)
      }),
    [action],
  )
  return pressed
}
