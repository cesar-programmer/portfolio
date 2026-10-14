import { useRef, useState, type ReactNode } from 'react'
import { useControls } from '../console/useControls'

export type MenuItem = {
  id: string
  label: ReactNode
  onSelect: () => void
  disabled?: boolean
}

type Props = {
  items: MenuItem[]
  label: string
  initialIndex?: number
  onCursorChange?: (index: number) => void
  onBack?: () => void
  className?: string
  itemClassName?: string
  /** Desactiva el control por teclado (por ejemplo, si hay otra ventana encima). */
  active?: boolean
}

/**
 * Lista con cursor ▶. El cursor sigue al foco real del navegador para que
 * teclado, lectores de pantalla, clic y toque se comporten igual.
 */
export function Menu({ items, label, initialIndex = 0, onCursorChange, onBack, className = '', itemClassName = '', active = true }: Props) {
  const [cursor, setCursor] = useState(initialIndex)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const move = (index: number, focus: boolean) => {
    const next = (index + items.length) % items.length
    setCursor(next)
    onCursorChange?.(next)
    if (focus) refs.current[next]?.focus()
  }

  useControls((action) => {
    switch (action) {
      case 'up':
        move(cursor - 1, true)
        return true
      case 'down':
        move(cursor + 1, true)
        return true
      case 'a': {
        const item = items[cursor]
        if (item && !item.disabled) item.onSelect()
        return true
      }
      case 'b':
        if (!onBack) return false
        onBack()
        return true
    }
  }, active)

  return (
    <ul role="menu" aria-label={label} className={className}>
      {items.map((item, i) => {
        const selected = i === cursor
        return (
          <li key={item.id} role="none">
            <button
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="menuitem"
              data-menu-item
              aria-disabled={item.disabled || undefined}
              tabIndex={selected ? 0 : -1}
              className={`flex w-full cursor-pointer items-center gap-2 text-left outline-offset-0 ${itemClassName}`}
              onFocus={() => i !== cursor && move(i, false)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && i !== cursor && move(i, false)}
              onClick={() => {
                if (i !== cursor) move(i, false)
                if (!item.disabled) item.onSelect()
              }}
            >
              <span aria-hidden="true" className={`w-[1ch] shrink-0 ${selected ? 'gb-blink' : 'invisible'}`}>
                ▶
              </span>
              <span>{item.label}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
