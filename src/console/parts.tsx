import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { play } from '../audio/sfx'
import type { Lang } from '../config'
import { getContent, type UiText } from '../content'
import { recruiterPath, sectionPath } from '../routes'
import { useGame } from '../store/game'
import { ConsoleButton } from './ConsoleButton'

type ConsoleUi = UiText['console']

const ARROWS = { up: '▲', down: '▼', left: '◀', right: '▶' } as const

export function DPad({ ui }: { ui: ConsoleUi }) {
  return (
    <div className="dpad" role="group" aria-label="D-pad">
      {(['up', 'left', 'right', 'down'] as const).map((dir) => (
        <ConsoleButton key={dir} action={dir} label={ui.dpad[dir]} className={`dpad__btn dpad__btn--${dir}`}>
          <span aria-hidden="true">{ARROWS[dir]}</span>
        </ConsoleButton>
      ))}
      <span className="dpad__center" aria-hidden="true" />
    </div>
  )
}

export function ABButtons({ ui }: { ui: ConsoleUi }) {
  return (
    <div className="ab">
      {(['b', 'a'] as const).map((key) => (
        <div key={key} className={`ab__item ab__item--${key}`}>
          <ConsoleButton action={key} label={ui[key]} className="ab__btn" />
          <span className="engraved" aria-hidden="true">
            {key.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  )
}

export function StartSelect({ ui }: { ui: ConsoleUi }) {
  return (
    <div className="pills">
      {(['select', 'start'] as const).map((key) => (
        <div key={key} className="rkey">
          <ConsoleButton action={key} label={ui[key]} className="rkey__hit">
            <span className="rkey__pill" aria-hidden="true" />
          </ConsoleButton>
          <span className="engraved" aria-hidden="true">
            {ui.labels[key]}
          </span>
        </div>
      ))}
    </div>
  )
}

export function Shoulder({ side, ui }: { side: 'l' | 'r'; ui: ConsoleUi }) {
  return (
    <ConsoleButton action={side} label={ui[side]} className={`shoulder shoulder--${side}`}>
      <span className="engraved" aria-hidden="true">
        {ui.labels[side]}
      </span>
    </ConsoleButton>
  )
}

// Iconos grabados de 7×7 para las teclas de la carcasa.
const KEY_ICONS = {
  cv: 'M3 0h1v4h2v1H5v1H4v1H3V6H2V5H1V4h2z',
  contact: 'M0 1h7v5H0zM1 2v3h5V2H5v1H4v1H3V3H2V2z',
  tv: 'M2 0h1v1h1V0h1v1h2v5H0V1h2zM1 2v3h5V2z',
  recruiter: 'M0 1h1v1h1v1h1v1H2v1H1v1H0zM3 1h1v1h1v1h1v1H5v1H4v1H3z',
}

function KeyLabel({ icon, children }: { icon: keyof typeof KEY_ICONS; children: ReactNode }) {
  return (
    <span className="engraved" aria-hidden="true">
      <svg viewBox="0 0 7 7" shapeRendering="crispEdges" className="engraved__icon">
        <path fill="currentColor" fillRule="evenodd" d={KEY_ICONS[icon]} />
      </svg>
      {children}
    </span>
  )
}

/** CV, Contacto, Modo TV y Modo reclutador: teclas de goma siempre visibles. */
export function ShellKeys({ lang, ui }: { lang: Lang; ui: ConsoleUi }) {
  const cv = getContent(lang).profile.cv[lang]
  const pill = <span className="rkey__pill" aria-hidden="true" />
  return (
    <div className="keys">
      <div className="rkey">
        <a className="rkey__hit" href={cv} download aria-label={ui.cv} title={ui.cv} onClick={() => play('confirm')}>
          {pill}
        </a>
        <KeyLabel icon="cv">{ui.labels.cv}</KeyLabel>
      </div>
      <div className="rkey">
        <Link className="rkey__hit" to={sectionPath(lang, 'contact')} aria-label={ui.contact} title={ui.contact} onClick={() => play('confirm')}>
          {pill}
        </Link>
        <KeyLabel icon="contact">{ui.labels.contact}</KeyLabel>
      </div>
      <div className="rkey">
        <ConsoleButton action="tv" label={ui.tv} className="rkey__hit">
          {pill}
        </ConsoleButton>
        <KeyLabel icon="tv">{ui.labels.tv}</KeyLabel>
      </div>
      <div className="rkey">
        <Link className="rkey__hit" to={recruiterPath(lang)} aria-label={ui.recruiter} title={ui.recruiter} onClick={() => play('confirm')}>
          {pill}
        </Link>
        <KeyLabel icon="recruiter">{ui.labels.recruiter}</KeyLabel>
      </div>
    </div>
  )
}

/** Rejilla de la bocina; el ícono de sonido va integrado, pequeño. */
export function Speaker({ ui }: { ui: ConsoleUi }) {
  const sound = useGame((s) => s.sound)
  const toggleSound = useGame((s) => s.toggleSound)
  const label = sound ? ui.soundOn : ui.soundOff
  return (
    <button
      type="button"
      className="speaker shell-btn"
      aria-label={label}
      aria-pressed={sound}
      title={label}
      onClick={() => {
        toggleSound()
        play('confirm')
      }}
    >
      <span className="speaker__slots" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </span>
      <svg className="speaker__icon" viewBox="0 0 9 9" shapeRendering="crispEdges" aria-hidden="true">
        <path fill="currentColor" d="M0 3h2v3H0zM2 2h1v5H2zM3 1h1v7H3z" />
        {sound ? (
          <path fill="currentColor" d="M5 3h1v3H5zM7 2h1v5H7z" />
        ) : (
          <path fill="currentColor" d="M5 3h1v1H5zM6 4h1v1H6zM7 5h1v1H7zM7 3h1v1H7zM5 5h1v1H5z" />
        )}
      </svg>
    </button>
  )
}

export function Brand() {
  return (
    <div className="brand" aria-hidden="true">
      CESAR<span>.DEV</span>
    </div>
  )
}

/** Leyenda fina del marco y LED de encendido. */
export function BezelDecor() {
  return (
    <>
      <div className="bezel__label" aria-hidden="true">
        PIXEL SCREEN · 32K COLORS
      </div>
      <div className="led" aria-hidden="true">
        POWER
      </div>
    </>
  )
}
