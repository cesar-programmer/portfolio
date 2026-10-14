import { useState } from 'react'
import { Link } from 'react-router'
import { play } from '../audio/sfx'
import type { Content } from '../content'
import { sectionPath } from '../routes'
import { useGame } from '../store/game'
import { PixelIcon } from '../ui/PixelIcon'

// Versiones sencillas de las demás pestañas. Se pulen en la siguiente fase.

function Heading({ children }: { children: React.ReactNode }) {
  return <h1 className="scr-title text-title m-0">{children}</h1>
}
function Sub({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sub text-scr-title-dim m-0 mb-2 font-pixel">{children}</h2>
}

export function AboutTab({ content }: { content: Content }) {
  const { lang, ui, profile, projects } = content
  const rows: [string, string][] = [
    [ui.about.class, profile.class],
    [ui.about.base, profile.base],
    [ui.about.languages, profile.languages.join(' · ')],
    [ui.about.education, profile.education],
  ]
  return (
    <div className="flex flex-col gap-4 p-3">
      <section className="px-box flex flex-col gap-2 p-3">
        <Heading>{profile.name}</Heading>
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-scr-muted">{k}</dt>
              <dd className="m-0">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="m-0">{profile.summary}</p>
        <p className="m-0">{profile.lookingFor}</p>
      </section>
      <section>
        <Sub>{ui.about.specialMoves.toUpperCase()}</Sub>
        <ul className="m-0 grid list-none gap-2 p-0">
          {profile.specialMoves.map((move) => {
            const project = projects.find((p) => p.slug === move.project)
            return (
              <li key={move.id} className="px-box p-2">
                <p className="text-scr-title m-0 font-pixel text-sub">{move.name.toUpperCase()}</p>
                <p className="m-0">
                  {move.evidence}{' '}
                  {project && (
                    <Link to={sectionPath(lang, 'projects', project.slug)} className="text-scr-accent underline underline-offset-4">
                      {project.name}
                    </Link>
                  )}
                </p>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export function SkillsTab({ content }: { content: Content }) {
  const { lang, pockets, projects, skillsText, experience, badges } = content
  const [selected, setSelected] = useState(pockets[0].items[0].id)
  const item = pockets.flatMap((p) => p.items).find((i) => i.id === selected)!
  return (
    <div className="flex flex-col gap-4 p-3">
      {pockets.map((pocket) => (
        <section key={pocket.id}>
          <Sub>{pocket.name.toUpperCase()}</Sub>
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {pocket.items.map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  className={`px-btn ${i.id === selected ? 'px-btn--primary' : ''}`}
                  aria-pressed={i.id === selected}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setSelected(i.id)}
                  onClick={() => {
                    setSelected(i.id)
                    play('cursor')
                  }}
                >
                  {i.label}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section className="px-box sticky bottom-0 p-3" aria-live="polite">
        <p className="scr-title text-sub m-0">{item.label}</p>
        {item.note && <p className="text-scr-muted m-0">{item.note}</p>}
        {item.projects.length > 0 && (
          <p className="m-0">
            {skillsText.usedIn}{' '}
            {item.projects.map((slug, n) => {
              const p = projects.find((x) => x.slug === slug)!
              return (
                <span key={slug}>
                  {n > 0 && ' · '}
                  <Link to={sectionPath(lang, 'projects', slug)} className="text-scr-accent underline underline-offset-4">
                    {p.name}
                  </Link>
                </span>
              )
            })}
          </p>
        )}
        {item.experience.length > 0 && (
          <p className="m-0">
            {skillsText.experienceIn}{' '}
            {item.experience.map((id) => experience.missions.find((m) => m.id === id)?.org).join(' · ')}
          </p>
        )}
        {item.badges.length > 0 && (
          <p className="m-0">
            {skillsText.badgeIn} {item.badges.map((id) => badges.badges.find((b) => b.id === id)?.name).join(' · ')}
          </p>
        )}
        {!item.projects.length && !item.experience.length && !item.badges.length && (
          <p className="text-scr-muted m-0">{skillsText.noProof}</p>
        )}
      </section>
    </div>
  )
}

export function MissionsTab({ content }: { content: Content }) {
  const { lang, ui, experience } = content
  return (
    <div className="flex flex-col gap-4 p-3">
      <section>
        <Sub>{ui.missions.experience.toUpperCase()}</Sub>
        <ul className="m-0 grid list-none gap-2 p-0">
          {experience.missions.map((m) => (
            <li key={m.id} className="px-box p-3">
              <p className="text-scr-muted m-0 font-pixel text-sub">✓ {m.status.toUpperCase()}</p>
              <p className="scr-title text-sub m-0 mt-1">{m.role}</p>
              <p className="m-0">{m.org}</p>
              {m.period && <p className="text-scr-muted m-0">{m.period}</p>}
              <ul className="m-0 mt-1 list-none p-0">
                {m.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <PixelIcon name="right" size="sm" className="text-scr-title-dim mt-[0.4em]" />
                    {pt}
                  </li>
                ))}
              </ul>
              {'project' in m && m.project && (
                <Link to={sectionPath(lang, 'projects', m.project)} className="px-btn mt-2">
                  {ui.missions.seeProject} <PixelIcon name="right" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <Sub>{ui.missions.education.toUpperCase()}</Sub>
        <ul className="m-0 grid list-none gap-2 p-0">
          {experience.education.map((e) => (
            <li key={e.id} className="px-box p-3">
              <p className="scr-title text-sub m-0">{e.title}</p>
              <p className="m-0">
                {e.org}
                {e.period && <span className="text-scr-muted"> · {e.period}</span>}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export function BadgesTab({ content }: { content: Content }) {
  const { ui, badges, projects } = content
  const visited = useGame((s) => s.visited)
  const explorer = projects.every((p) => visited.includes(p.slug))
  const earned = badges.badges.filter((b) => !b.secret || explorer)
  const secret = badges.badges.find((b) => b.secret)
  const slots = Array.from({ length: badges.slots }, (_, i) => earned[i] ?? null)
  return (
    <div className="flex flex-col gap-3 p-3">
      <Heading>{ui.tabs.badges}</Heading>
      <ul className="badge-case m-0 list-none p-0" aria-label={ui.badges.case}>
        {slots.map((b, i) =>
          b ? (
            <li key={b.id} className="px-box flex flex-col items-center gap-1 p-2 text-center">
              <PixelIcon name="badges" className="text-scr-title" />
              <p className="scr-title text-sub m-0">{b.name}</p>
              <p className="m-0">{b.detail}</p>
              <p className="text-scr-muted text-body m-0">{b.issuer}</p>
              {b.verifyUrl && (
                <a href={b.verifyUrl} target="_blank" rel="noreferrer" className="text-scr-accent underline">
                  {ui.badges.verify} ↗
                </a>
              )}
            </li>
          ) : (
            <li key={`empty-${i}`} className="badge-empty flex flex-col items-center justify-center gap-1 p-2 text-center">
              <span className="font-pixel text-sub" aria-label={ui.badges.locked}>
                {badges.lockedLabel}
              </span>
              {!explorer && i === earned.length && secret && <span className="text-scr-muted text-body">{badges.secretHint}</span>}
            </li>
          ),
        )}
      </ul>
    </div>
  )
}

export function ContactTab({ content }: { content: Content }) {
  const { ui, profile } = content
  const [copied, setCopied] = useState(false)
  const c = ui.contact
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.contact.email)
      setCopied(true)
      play('confirm')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sin portapapeles: el email sigue visible y seleccionable.
    }
  }
  return (
    <div className="flex flex-col gap-3 p-3">
      <Heading>{c.heading}</Heading>
      <p className="text-scr-muted m-0">{profile.lookingFor}</p>
      <section className="px-box flex flex-col gap-3 p-3">
        <div>
          <p className="text-scr-muted m-0">{c.email}</p>
          <div className="flex flex-wrap items-center gap-2">
            <a href={`mailto:${profile.contact.email}`} className="text-scr-accent break-all underline underline-offset-4">
              {profile.contact.email}
            </a>
            <button type="button" className="px-btn" onClick={copy} aria-live="polite">
              {copied ? c.copied : c.copy}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.contact.linkedin && (
            <a className="px-btn" href={profile.contact.linkedin} target="_blank" rel="noreferrer">
              {c.linkedin} ↗
            </a>
          )}
          <a className="px-btn" href={profile.contact.github} target="_blank" rel="noreferrer">
            {c.github} · {profile.contact.githubHandle} ↗
          </a>
        </div>
        <div>
          <p className="text-scr-muted m-0 mb-1">{c.cv}</p>
          <div className="flex flex-wrap gap-2">
            <a className="px-btn px-btn--primary" href={profile.cv.es} download>
              {c.cvEs} ⬇
            </a>
            <a className="px-btn px-btn--primary" href={profile.cv.en} download>
              {c.cvEn} ⬇
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
