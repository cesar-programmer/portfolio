import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { play } from '../audio/sfx'
import { useControls } from '../console/useControls'
import type { Content } from '../content'
import { sectionPath } from '../routes'
import { useGame } from '../store/game'
import { Medal } from '../ui/Medal'
import type { IconName } from '../ui/PixelIcon'

const EMBLEM: Record<string, IconName> = {
  'aws-cloud-architecting': 'cloud',
  'tensorflow-developer': 'ai',
  'space-apps-2025': 'rocket',
  explorer: 'compass',
}

/** MEDALLAS: vitrina de 8 huecos; al elegir uno se ve su detalle. */
export function BadgesTab({ content }: { content: Content }) {
  const { lang, ui, badges, projects } = content
  const visited = useGame((s) => s.visited)
  const explorer = projects.every((p) => visited.includes(p.slug))
  const earned = badges.badges.filter((b) => !b.secret || explorer)
  const secret = badges.badges.find((b) => b.secret)
  const slots = Array.from({ length: badges.slots }, (_, i) => earned[i] ?? null)
  const [index, setIndex] = useState(0)
  const grid = useRef<HTMLUListElement>(null)
  const cells = useRef<(HTMLButtonElement | null)[]>([])

  const columns = () => (grid.current ? getComputedStyle(grid.current).gridTemplateColumns.split(' ').length : 4)
  const select = (i: number, focus = true) => {
    if (i < 0 || i >= slots.length) return
    if (i !== index) play('cursor')
    setIndex(i)
    if (focus) cells.current[i]?.focus()
  }

  useControls((action) => {
    const cols = columns()
    if (action === 'left') select(index - 1)
    else if (action === 'right') select(index + 1)
    else if (action === 'up') select(index - cols)
    else if (action === 'down') select(index + cols)
    else return false
    return true
  })

  const badge = slots[index]
  const linked = badge && 'project' in badge && badge.project ? projects.find((p) => p.slug === badge.project) : undefined

  return (
    <div className="flex flex-col gap-5 p-4">
      <h1 className="scr-title text-title m-0">{ui.tabs.badges}</h1>
      <ul ref={grid} className="badge-case" aria-label={ui.badges.case}>
        {slots.map((b, i) => (
          <li key={b?.id ?? `empty-${i}`}>
            <button
              ref={(el) => {
                cells.current[i] = el
              }}
              type="button"
              data-menu-item
              aria-current={i === index ? 'true' : undefined}
              aria-label={b ? b.name : ui.badges.locked}
              className={`badge-slot ${b ? '' : 'badge-slot--empty'}`}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setIndex(i)}
              onFocus={() => setIndex(i)}
              onClick={() => select(i, false)}
            >
              {b ? <Medal icon={EMBLEM[b.id] ?? 'badges'} /> : <span className="font-pixel text-sub">{badges.lockedLabel}</span>}
              <span className="badge-slot__name">{b ? b.name : ''}</span>
            </button>
          </li>
        ))}
      </ul>

      <section className="px-box flex min-h-[calc(120px*var(--fz))] flex-col gap-2 p-4" aria-live="polite">
        {badge ? (
          <>
            <h2 className="scr-title text-title m-0">{badge.name}</h2>
            <p className="m-0">{badge.detail}</p>
            <p className="text-scr-muted m-0">{badge.issuer}</p>
            <div className="flex flex-wrap gap-4">
              {badge.verifyUrl && (
                <a href={badge.verifyUrl} target="_blank" rel="noreferrer" className="link">
                  {ui.badges.verify} ↗
                </a>
              )}
              {linked && (
                <Link to={sectionPath(lang, 'projects', linked.slug)} className="link">
                  {linked.name} →
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="scr-title text-title m-0">{badges.lockedLabel}</h2>
            <p className="text-scr-muted m-0">{!explorer && secret && index === earned.length ? badges.secretHint : ui.badges.locked}</p>
          </>
        )}
      </section>
    </div>
  )
}
