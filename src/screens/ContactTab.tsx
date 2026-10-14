import { useRef, useState } from 'react'
import { play } from '../audio/sfx'
import type { Content } from '../content'
import { PixelIcon } from '../ui/PixelIcon'
import { SectionHead } from './SectionHead'
import { useFocusNav } from './useFocusNav'

/** CONTACTO: email (copiar), perfiles y CV, todo a un clic. Sin teléfono. */
export function ContactTab({ content }: { content: Content }) {
  const { ui, profile } = content
  const c = ui.contact
  const ref = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  useFocusNav(ref)

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
    <div ref={ref} className="flex flex-col gap-6 p-4">
      <header className="flex flex-col gap-1">
        <h1 className="scr-title text-title m-0">{c.heading}</h1>
        <p className="text-scr-muted m-0">{profile.lookingFor}</p>
      </header>

      <section className="px-box flex flex-col gap-3 p-4" aria-labelledby="email-head">
        <SectionHead icon="contact" id="email-head">
          {c.email.toUpperCase()}
        </SectionHead>
        <a data-nav href={`mailto:${profile.contact.email}`} className="link break-all">
          {profile.contact.email}
        </a>
        <div>
          <button data-nav type="button" className="px-btn" onClick={copy}>
            {copied ? `${c.copied} ✓` : c.copy}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? c.copied : ''}
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="profiles-head">
        <SectionHead icon="about" id="profiles-head">
          {c.profiles.toUpperCase()}
        </SectionHead>
        <div className="flex flex-wrap gap-3">
          <a data-nav className="px-btn" href={profile.contact.github} target="_blank" rel="noreferrer">
            {c.github} · {profile.contact.githubHandle} ↗
          </a>
          {profile.contact.linkedin && (
            <a data-nav className="px-btn" href={profile.contact.linkedin} target="_blank" rel="noreferrer">
              {c.linkedin} ↗
            </a>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="cv-head">
        <SectionHead icon="missions" id="cv-head">
          {c.cv.toUpperCase()}
        </SectionHead>
        <div className="flex flex-wrap gap-3">
          <a data-nav className="px-btn px-btn--primary" href={profile.cv.es} download>
            <PixelIcon name="down" size="sm" /> {c.cvEs}
          </a>
          <a data-nav className="px-btn px-btn--primary" href={profile.cv.en} download>
            <PixelIcon name="down" size="sm" /> {c.cvEn}
          </a>
        </div>
      </section>
    </div>
  )
}
