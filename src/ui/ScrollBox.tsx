import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { PixelIcon } from './PixelIcon'

type Props = {
  as?: ElementType
  /** Clases del contenedor externo (posición, sticky, alto máximo). */
  className?: string
  /** Clases de la caja que hace scroll (fondo, borde, padding). */
  innerClassName?: string
  /** Cambia para volver arriba (por ejemplo, el proyecto señalado). */
  resetKey?: string
  children: ReactNode
  [aria: `aria-${string}`]: string | undefined
}

/**
 * Panel con scroll propio cuando no cabe completo en la pantalla.
 * Muestra un ▼ sutil mientras quede contenido abajo.
 */
export function ScrollBox({ as: Tag = 'div', className = '', innerClassName = '', resetKey, children, ...aria }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [more, setMore] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 2)
    check()
    el.addEventListener('scroll', check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)
    for (const child of el.children) ro.observe(child)
    return () => {
      el.removeEventListener('scroll', check)
      ro.disconnect()
    }
  }, [resetKey])

  useEffect(() => {
    ref.current?.scrollTo({ top: 0 })
  }, [resetKey])

  return (
    <Tag className={`scroll-box-wrap ${className}`} {...aria}>
      <div ref={ref} className={`scroll-box ${innerClassName}`}>
        {children}
      </div>
      {more && (
        <span className="scroll-more" aria-hidden="true">
          <PixelIcon name="down" size="sm" />
        </span>
      )}
    </Tag>
  )
}
