import type { ReactNode } from 'react'
import { PixelIcon, type IconName } from '../ui/PixelIcon'

/** Encabezado discreto de grupo (ámbar tenue, tamaño subtítulo). */
export function SectionHead({ icon, children, id }: { icon?: IconName; children: ReactNode; id?: string }) {
  return (
    <h2 className="zone-head" id={id}>
      {icon && <PixelIcon name={icon} size="sm" />}
      {children}
    </h2>
  )
}
