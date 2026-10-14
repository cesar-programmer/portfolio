import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { getContent } from '../content'
import { isLang, sectionPath } from '../routes'

/** Provisional: el Modo reclutador completo llega en la fase 4. */
export function RecruiterPage() {
  const { lang } = useParams()
  const ok = isLang(lang)
  useEffect(() => {
    if (ok) document.documentElement.lang = lang
  }, [ok, lang])
  if (!ok) return <Navigate to="/" replace />
  const { ui, profile } = getContent(lang)
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-4 p-6 font-body text-[18px]">
      <h1 className="scr-title m-0 text-[24px] leading-snug">{profile.name}</h1>
      <p className="m-0">{profile.title}</p>
      <p className="text-scr-muted m-0">{ui.recruiter.soon}</p>
      <Link to={sectionPath(lang, 'projects')} className="text-scr-accent underline underline-offset-4">
        {ui.recruiter.backToGame}
      </Link>
    </main>
  )
}
