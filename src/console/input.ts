// Bus de entrada único: teclado, botones de la carcasa (clic y táctil)
// y cualquier otro origen emiten las mismas acciones.

export type Action = 'up' | 'down' | 'left' | 'right' | 'a' | 'b' | 'start' | 'select'
export const DIRECTIONS: Action[] = ['up', 'down', 'left', 'right']

/** Devuelve true si consumió la acción; si no, pasa al siguiente handler de la pila. */
export type Handler = (action: Action) => boolean | void

const handlers: Handler[] = []
const pressListeners = new Set<(action: Action, down: boolean) => void>()

/** Registra un handler. El más reciente recibe las acciones primero. */
export function pushHandler(handler: Handler) {
  handlers.push(handler)
  return () => {
    const i = handlers.lastIndexOf(handler)
    if (i !== -1) handlers.splice(i, 1)
  }
}

export function dispatch(action: Action) {
  for (let i = handlers.length - 1; i >= 0; i--) {
    if (handlers[i](action) === true) return
  }
}

/** Para que los botones de la carcasa se vean presionados también con teclado. */
export function onPress(listener: (action: Action, down: boolean) => void) {
  pressListeners.add(listener)
  return () => {
    pressListeners.delete(listener)
  }
}

export function emitPress(action: Action, down: boolean) {
  pressListeners.forEach((l) => l(action, down))
}

const KEYMAP: Record<string, Action> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  Enter: 'a',
  z: 'a',
  Escape: 'b',
  x: 'b',
  Backspace: 'b',
  m: 'start',
  l: 'select',
}

function isTextField(el: Element | null) {
  return !!el && (el.matches('input, textarea, select, [contenteditable="true"]'))
}

/**
 * Enter solo se intercepta cuando el foco está en el cuerpo de la página o en
 * una opción de menú: así los botones normales (carcasa, enlaces sueltos)
 * conservan su comportamiento nativo.
 */
function shouldInterceptEnter(el: Element | null) {
  if (!el || el === document.body) return true
  if (el.closest('[data-gb-button]')) return false
  return el.matches('[data-menu-item], #screen')
}

export function installKeyboard() {
  const down = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const active = document.activeElement
    if (isTextField(active)) return
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
    const action = KEYMAP[key]
    if (!action) return
    if (key === 'Enter' && !shouldInterceptEnter(active)) return
    e.preventDefault()
    // Las direcciones pueden repetirse al mantener la tecla; A/B/START/SELECT no.
    if (e.repeat && !DIRECTIONS.includes(action)) return
    emitPress(action, true)
    dispatch(action)
  }
  const up = (e: KeyboardEvent) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
    const action = KEYMAP[key]
    if (action) emitPress(action, false)
  }
  window.addEventListener('keydown', down)
  window.addEventListener('keyup', up)
  return () => {
    window.removeEventListener('keydown', down)
    window.removeEventListener('keyup', up)
  }
}
