import { iconPath, type IconName } from './icons'

// Medalla pixel de 16 × 20: listón, disco ámbar y emblema de 8×8.
// Sin desbloquear: hueco punteado con "???".

export function Medal({ icon, label }: { icon: IconName; label?: string }) {
  return (
    <svg viewBox="0 0 16 20" shapeRendering="crispEdges" className="medal" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {/* listón */}
      <rect x="4" y="0" width="3" height="6" fill="var(--scr-title-dim)" />
      <rect x="9" y="0" width="3" height="6" fill="var(--scr-muted)" />
      <rect x="7" y="0" width="2" height="5" fill="var(--scr-line)" />
      {/* disco */}
      <rect x="4" y="5" width="8" height="1" fill="var(--scr-title-dim)" />
      <rect x="2" y="6" width="12" height="2" fill="var(--scr-title)" />
      <rect x="1" y="8" width="14" height="8" fill="var(--scr-title)" />
      <rect x="2" y="16" width="12" height="2" fill="var(--scr-title)" />
      <rect x="4" y="18" width="8" height="1" fill="var(--scr-title-dim)" />
      <rect x="1" y="15" width="14" height="1" fill="var(--scr-title-dim)" />
      <rect x="2" y="17" width="12" height="1" fill="var(--scr-title-dim)" />
      {/* brillo */}
      <rect x="3" y="7" width="2" height="1" fill="var(--scr-ink)" opacity="0.7" />
      {/* emblema */}
      <path d={iconPath(icon)} transform="translate(4 8)" fill="var(--scr-bg)" />
    </svg>
  )
}
