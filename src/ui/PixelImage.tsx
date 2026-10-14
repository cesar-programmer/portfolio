import { useEffect, useState } from 'react'
import { play } from '../audio/sfx'
import { useGame } from '../store/game'
import { ditherImage } from './dither'
import { useReducedMotion } from './useReducedMotion'

type Props = {
  src: string
  alt: string
  /** Muestra el botón "Ver a color". */
  toggle?: { color: string; pixel: string }
  className?: string
}

/**
 * Captura real mostrada con la paleta de la pantalla. Con "Ver a color" se
 * transforma (parpadeo blanco) en la imagen original. Siempre es un <img>.
 */
export function PixelImage({ src, alt, toggle, className = '' }: Props) {
  const palette = useGame((s) => s.palette)
  const reduced = useReducedMotion()
  const [dithered, setDithered] = useState<{ key: string; url: string } | null>(null)
  const [color, setColor] = useState(false)
  const [flash, setFlash] = useState(0)
  const key = `${src}|${palette}`

  useEffect(() => {
    let alive = true
    ditherImage(src, 240, palette)
      .then((url) => alive && setDithered({ key, url }))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [src, palette, key])

  const pixelUrl = dithered?.key === key ? dithered.url : null
  const showColor = color || !pixelUrl

  const swap = () => {
    play('confirm')
    setColor((c) => !c)
    if (!reduced) setFlash((n) => n + 1)
  }

  return (
    <figure className={`relative m-0 ${className}`}>
      <div className="px-box relative overflow-hidden p-0">
        <img
          src={showColor ? src : pixelUrl}
          alt={alt}
          className="block aspect-[8/5] w-full object-cover object-top"
          style={{ imageRendering: showColor ? 'auto' : 'pixelated' }}
          loading="lazy"
          decoding="async"
        />
        {flash > 0 && <span key={flash} className="px-evolve" aria-hidden="true" />}
      </div>
      {toggle && pixelUrl && (
        <button type="button" className="px-btn mt-2" onClick={swap} aria-pressed={color}>
          {color ? toggle.pixel : toggle.color}
        </button>
      )}
    </figure>
  )
}
