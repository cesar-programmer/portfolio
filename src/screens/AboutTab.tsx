import { useRef } from 'react'
import { Link } from 'react-router'
import type { Content } from '../content'
import { sectionPath } from '../routes'
import { PixelIcon } from '../ui/PixelIcon'
import { Portrait } from '../ui/Portrait'
import { SectionHead } from './SectionHead'
import { useFocusNav } from './useFocusNav'

/** YO: credencial de entrenador y habilidades especiales con evidencia. */
export function AboutTab({ content }: { content: Content }) {
  const { lang, ui, profile, projects } = content
  const ref = useRef<HTMLDivElement>(null)
  useFocusNav(ref)

  const rows: [string, string][] = [
    [ui.about.class, profile.class],
    [ui.about.base, profile.base],
    [ui.about.languages, profile.languages.join(' · ')],
    [ui.about.education, profile.education],
  ]

  return (
    <div ref={ref} className="flex flex-col gap-6 p-4">
      <section className="trainer-card px-box" aria-labelledby="trainer-name">
        <div className="trainer-card__portrait">
          <Portrait label={profile.name} />
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <div>
            <h1 id="trainer-name" className="scr-title text-title m-0">
              {profile.name}
            </h1>
            <p className="text-scr-muted m-0">{profile.title}</p>
          </div>
          <dl className="trainer-card__stats">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <p className="m-0">{profile.summary}</p>
        <p className="text-scr-title m-0">{profile.lookingFor}</p>
      </section>

      <section aria-labelledby="moves-head">
        <SectionHead icon="star" id="moves-head">
          {ui.about.specialMoves.toUpperCase()}
        </SectionHead>
        <ul className="moves">
          {profile.specialMoves.map((move) => {
            const project = projects.find((p) => p.slug === move.project)
            return (
              <li key={move.id} className="move">
                <p className="move__name">
                  <PixelIcon name="right" size="sm" />
                  {move.name}
                </p>
                <p className="m-0">{move.evidence}</p>
                {project && (
                  <Link data-nav to={sectionPath(lang, 'projects', project.slug)} className="link">
                    {project.name} →
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
