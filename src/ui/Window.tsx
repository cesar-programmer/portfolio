import type { ElementType, ReactNode } from 'react'

type Props = { as?: ElementType; className?: string; children: ReactNode; label?: string }

/** Caja con borde doble, como las ventanas de los RPG portátiles. */
export function Window({ as: Tag = 'div', className = '', children, label }: Props) {
  return (
    <Tag className={`gb-window ${className}`} aria-label={label}>
      {children}
    </Tag>
  )
}
