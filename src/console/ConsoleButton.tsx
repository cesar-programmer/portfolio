import { useEffect, useRef, type ReactNode } from 'react'
import { DIRECTIONS, dispatch, emitPress, type Action } from './input'
import { usePressed } from './useControls'

type Props = {
  action: Action
  label: string
  className?: string
  children?: ReactNode
}

const REPEAT_DELAY = 380
const REPEAT_EVERY = 130

/**
 * Botón físico de la carcasa. Responde al instante con pointerdown (táctil y
 * ratón), repite las direcciones al mantenerlo, y sigue siendo un <button>
 * real para teclado y lectores de pantalla.
 */
export function ConsoleButton({ action, label, className = '', children }: Props) {
  const pressed = usePressed(action)
  const timers = useRef<number[]>([])

  const stop = () => {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
    emitPress(action, false)
  }
  // Al desmontar, cancela cualquier repetición pendiente.
  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), [])

  const start = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return
    e.preventDefault() // evita robar el foco y el zoom por doble toque
    e.currentTarget.setPointerCapture?.(e.pointerId)
    emitPress(action, true)
    dispatch(action)
    if (DIRECTIONS.includes(action)) {
      const delay = window.setTimeout(() => {
        timers.current.push(window.setInterval(() => dispatch(action), REPEAT_EVERY))
      }, REPEAT_DELAY)
      timers.current.push(delay)
    }
  }

  return (
    <button
      type="button"
      data-gb-button={action}
      aria-label={label}
      title={label}
      className={`shell-btn ${className}`}
      data-pressed={pressed || undefined}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
        // detail === 0: activado con teclado (Enter/Espacio sobre el botón).
        if (e.detail === 0) dispatch(action)
      }}
    >
      {children}
    </button>
  )
}
