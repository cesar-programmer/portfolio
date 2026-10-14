import { paths, type IconName } from './icons'

export type { IconName }

type Props = {
  name: IconName
  /** sm = 8px (escala 1), md = 16px (escala 2). Ambos crecen en múltiplos enteros con la pantalla. */
  size?: 'sm' | 'md'
  className?: string
  label?: string
}

export function PixelIcon({ name, size = 'md', className = '', label }: Props) {
  return (
    <svg
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      className={`px-icon px-icon--${size} ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path fill="currentColor" d={paths[name]} />
    </svg>
  )
}
