import { useRef } from 'react'
import { Link } from 'react-router'
import type { Content } from '../content'
import { sectionPath } from '../routes'
import { PixelIcon } from '../ui/PixelIcon'
import { SectionHead } from './SectionHead'
import { useFocusNav } from './useFocusNav'

/** MISIONES: bitácora de experiencia y formación en línea de tiempo. */
export function MissionsTab({ content }: { content: Content }) {
  const { lang, ui, experience, projects } = content
  const ref = useRef<HTMLDivElement>(null)
  useFocusNav(ref)

  return (
    <div ref={ref} className="flex flex-col gap-6 p-4">
      <section aria-labelledby="missions-head">
        <SectionHead icon="missions" id="missions-head">
          {ui.missions.experience.toUpperCase()}
        </SectionHead>
        <ol className="timeline">
          {experience.missions.map((m) => {
            const project = 'project' in m && m.project ? projects.find((p) => p.slug === m.project) : undefined
            return (
              <li key={m.id} className="timeline__item">
                <span className="timeline__dot" aria-hidden="true">
                  <PixelIcon name="check" size="sm" />
                </span>
                <p className="text-scr-muted m-0 font-pixel text-sub">{m.status.toUpperCase()}</p>
                <p className="text-scr-title m-0">{m.role}</p>
                <p className="m-0">{m.org}</p>
                {m.period && <p className="text-scr-muted m-0">{m.period}</p>}
                <ul className="mt-2 mb-0 flex list-none flex-col gap-1 p-0">
                  {m.points.map((pt) => (
                    <li key={pt} className="flex gap-2">
                      <PixelIcon name="right" size="sm" className="text-scr-title-dim mt-[0.45em]" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                {project && (
                  <Link data-nav to={sectionPath(lang, 'projects', project.slug)} className="link mt-2 inline-block">
                    {ui.missions.seeProject}: {project.name} →
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="education-head">
        <SectionHead icon="book" id="education-head">
          {ui.missions.education.toUpperCase()}
        </SectionHead>
        <ol className="timeline">
          {experience.education.map((e) => (
            <li key={e.id} className="timeline__item">
              <span className="timeline__dot" aria-hidden="true">
                <PixelIcon name="book" size="sm" />
              </span>
              <p className="text-scr-title m-0">{e.title}</p>
              <p className="m-0">
                {e.org}
                {e.period && <span className="text-scr-muted"> · {e.period}</span>}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
