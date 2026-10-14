import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { play } from '../audio/sfx'
import type { Lang } from '../config'
import type { UiText } from '../content'
import { SECTIONS, sectionPath, type Section } from '../routes'
import { PixelIcon } from '../ui/PixelIcon'

type Props = { lang: Lang; active: Section; ui: UiText['tabs'] }

/** Fila fija de pestañas: cualquier sección a un clic. */
export function Tabs({ lang, active, ui }: Props) {
  const activeRef = useRef<HTMLAnchorElement>(null)

  // En pantallas angostas, mantener visible la pestaña activa.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [active])

  return (
    <nav className="tabs" aria-label={ui.label}>
      <ul>
        {SECTIONS.map((section) => {
          const current = section === active
          return (
            <li key={section}>
              <Link
                ref={current ? activeRef : undefined}
                to={sectionPath(lang, section)}
                className="tab"
                aria-current={current ? 'page' : undefined}
                onClick={() => !current && play('tab')}
              >
                <PixelIcon name={section} />
                <span>{ui[section]}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
