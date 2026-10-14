import { Link, useParams } from 'react-router'
import { cvLink, type Lang } from '../config'
import { getContent } from '../content'
import { NotFound } from '../NotFound'
import { isLang, recruiterPath, sectionPath } from '../routes'
import './recruiter.css'

/**
 * Modo reclutador: todo el portafolio en una página limpia, sin consola.
 * Títulos con la fuente pixel; cuerpo en la fuente del sistema. Imprimible.
 */
export default function RecruiterPage() {
  const { lang } = useParams()
  if (!isLang(lang)) return <NotFound />
  return <Recruiter lang={lang} />
}

function Recruiter({ lang }: { lang: Lang }) {
  const { ui, profile, recruiterHighlights, experience, pockets, badges, techLabel } = getContent(lang)
  const r = ui.recruiter
  const other: Lang = lang === 'es' ? 'en' : 'es'
  const cv = cvLink(lang)
  const contact = profile.contact

  return (
    <div className="cv">
      <nav className="cv-nav" aria-label={r.backToGame}>
        <Link to={sectionPath(lang, 'projects')} className="cv-btn cv-btn--primary">
          {r.backToGame}
        </Link>
        <div className="cv-nav__right">
          {cv.download && (
            <a href={cv.href} download className="cv-btn">
              {r.downloadCv}
            </a>
          )}
          <button type="button" className="cv-btn" onClick={() => window.print()}>
            {r.print}
          </button>
          <Link to={recruiterPath(other)} className="cv-btn" lang={other} hrefLang={other}>
            {other.toUpperCase()}
          </Link>
        </div>
      </nav>

      <main className="cv-page">
        <header className="cv-header">
          <h1>{profile.name}</h1>
          <p className="cv-header__title">{profile.title}</p>
          <p className="cv-muted">
            {profile.base} · {profile.languages.join(' · ')}
          </p>
          <ul className="cv-contact" aria-label={r.contact}>
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <a href={contact.github}>github.com/{contact.githubHandle}</a>
            </li>
            {contact.linkedin && (
              <li>
                <a href={contact.linkedin}>LinkedIn</a>
              </li>
            )}
          </ul>
        </header>

        <section aria-labelledby="cv-summary">
          <h2 id="cv-summary">{r.summary}</h2>
          <p>{profile.summary}</p>
          <p className="cv-strong">{profile.lookingFor}</p>
        </section>

        <section aria-labelledby="cv-projects">
          <h2 id="cv-projects">{r.projects}</h2>
          {recruiterHighlights.map((p) => (
            <article key={p.slug} className="cv-item">
              <h3>
                <Link to={sectionPath(lang, 'projects', p.slug)}>{p.name}</Link>
                {p.subtitle && <span className="cv-muted"> — {p.subtitle}</span>}
              </h3>
              <p className="cv-meta">
                {p.role}
                {p.year && ` · ${p.year}`}
                {p.production && ` · ${ui.tags.production}`}
                {p.codePrivate ? ` · ${r.privateCode}` : p.links.code && ' · '}
                {!p.codePrivate && p.links.code && <a href={p.links.code}>{r.code}</a>}
              </p>
              <p>{p.mission}</p>
              <p className="cv-muted cv-stack">{p.stack.map(techLabel).join(' · ')}</p>
              <Link to={sectionPath(lang, 'projects', p.slug)} className="cv-more">
                {r.seeProject} →
              </Link>
            </article>
          ))}
        </section>

        <section aria-labelledby="cv-experience">
          <h2 id="cv-experience">{r.experience}</h2>
          {experience.missions.map((m) => (
            <article key={m.id} className="cv-item">
              <h3>
                {m.role} <span className="cv-muted">— {m.org}</span>
              </h3>
              {m.period && <p className="cv-meta">{m.period}</p>}
              <ul>
                {m.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section aria-labelledby="cv-skills">
          <h2 id="cv-skills">{r.skills}</h2>
          <dl className="cv-skills">
            {pockets.map((p) => (
              <div key={p.id}>
                <dt>{p.name}</dt>
                <dd>{p.items.map((i) => i.label).join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="cv-badges">
          <h2 id="cv-badges">{r.badges}</h2>
          <ul>
            {badges.badges
              .filter((b) => !b.secret)
              .map((b) => (
                <li key={b.id}>
                  <strong>{b.name}</strong> — {b.detail} <span className="cv-muted">({b.issuer})</span>
                </li>
              ))}
          </ul>
        </section>

        <section aria-labelledby="cv-education">
          <h2 id="cv-education">{r.education}</h2>
          <ul>
            {experience.education.map((e) => (
              <li key={e.id}>
                <strong>{e.title}</strong> — {e.org}
                {e.period && <span className="cv-muted"> · {e.period}</span>}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
