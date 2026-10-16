import { useEffect, useState } from 'react'
import logo from '../assets/mychem-logo.png'

const SHOW_MS = 1800
const FADE_MS = 500

export default function Splash() {
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), SHOW_MS)
    const goneTimer = window.setTimeout(() => setGone(true), SHOW_MS + FADE_MS)
    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(goneTimer)
    }
  }, [])

  if (gone) return null

  return (
    <div className={`splash${leaving ? ' splash-leave' : ''}`} role="status" aria-label="Cargando">
      <div className="splash-mark" aria-hidden="true">
        <span className="splash-ring" />
        <span className="splash-ring splash-ring-2" />
        <img className="splash-logo" src={logo} alt="" />
      </div>
      <div className="splash-bar" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}