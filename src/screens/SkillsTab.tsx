import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { play } from '../audio/sfx'
import { useControls } from '../console/useControls'
import type { Content } from '../content'
import { sectionPath } from '../routes'
import { PixelIcon } from '../ui/PixelIcon'
import { Stars } from './projectBits'

/**
 * SKILLS (mochila): bolsillos como pestañas, ítems a la izquierda y, a la
 * derecha, dónde se usó cada uno (enlaces a las fichas): habilidad → prueba.
 */
export function SkillsTab({ content }: { content: Content }) {
  const { lang, ui, pockets, projects, skillsText, experience, badges } = content
  const navigate = useNavigate()
  const [pocketIndex, setPocketIndex] = useState(0)
  const [itemIndex, setItemIndex] = useState(0)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const pocket = pockets[pocketIndex]
  const item = pocket.items[Math.min(itemIndex, pocket.items.length - 1)]
  const used = item.projects.map((slug) => projects.find((p) => p.slug === slug)!)

  const selectPocket = (i: number) => {
    setPocketIndex((i + pockets.length) % pockets.length)
    setItemIndex(0)
    play('tab')
  }
  const selectItem = (i: number, focus: boolean) => {
    const n = (i + pocket.items.length) % pocket.items.length
    if (n !== itemIndex) play('cursor')
    setItemIndex(n)
    if (focus) itemRefs.current[n]?.focus()
  }

  useControls((action) => {
    switch (action) {
      case 'up':
        selectItem(itemIndex - 1, true)
        return true
      case 'down':
        selectItem(itemIndex + 1, true)
        return true
      case 'left':
        selectPocket(pocketIndex - 1)
        return true
      case 'right':
        selectPocket(pocketIndex + 1)
        return true
      case 'a':
        if (!used.length) return true
        play('confirm')
        navigate(sectionPath(lang, 'projects', used[0].slug))
        return true
    }
  })

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="pockets" role="tablist" aria-label={ui.skills.pockets}>
        {pockets.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === pocketIndex}
            className="pocket"
            onClick={() => i !== pocketIndex && selectPocket(i)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="skills-grid" role="tabpanel" aria-label={pocket.name}>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {pocket.items.map((i, n) => {
            const selected = i.id === item.id
            const proofs = i.projects.length + i.experience.length + i.badges.length
            return (
              <li key={i.id}>
                <button
                  ref={(el) => {
                    itemRefs.current[n] = el
                  }}
                  type="button"
                  data-menu-item
                  aria-current={selected ? 'true' : undefined}
                  className="proj-item w-full text-left"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && !selected && setItemIndex(n)}
                  onFocus={() => !selected && setItemIndex(n)}
                  onClick={() => selectItem(n, false)}
                >
                  <PixelIcon name="cursor" className={selected ? 'px-blink text-scr-title' : 'invisible'} />
                  <span className="min-w-0 flex-1">{i.label}</span>
                  {proofs > 0 && <span className="text-scr-muted">{proofs}</span>}
                </button>
              </li>
            )
          })}
        </ul>

        <aside className="skills-detail px-box flex flex-col gap-3 p-4" aria-live="polite">
          <div>
            <h2 className="scr-title text-title m-0">{item.label}</h2>
            {item.note && <p className="text-scr-muted m-0">{item.note}</p>}
          </div>
          {used.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-scr-muted m-0">{skillsText.usedIn}</p>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {used.map((p) => (
                  <li key={p.slug} className="flex flex-wrap items-center justify-between gap-x-3">
                    <Link to={sectionPath(lang, 'projects', p.slug)} className="link">
                      {p.name} →
                    </Link>
                    <Stars count={p.stars} label={ui.projects.difficulty} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {item.experience.length > 0 && (
            <p className="m-0">
              <span className="text-scr-muted">{skillsText.experienceIn} </span>
              {item.experience.map((id) => experience.missions.find((m) => m.id === id)?.org).join(' · ')}
            </p>
          )}
          {item.badges.length > 0 && (
            <p className="m-0">
              <span className="text-scr-muted">{skillsText.badgeIn} </span>
              {item.badges.map((id) => badges.badges.find((b) => b.id === id)?.name).join(' · ')}
            </p>
          )}
          {!used.length && !item.experience.length && !item.badges.length && (
            <p className="text-scr-muted m-0">{skillsText.noProof}</p>
          )}
        </aside>
      </div>
    </div>
  )
}
