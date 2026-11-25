import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SakugaTabs from './sakuga/SakugaTabs'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/results', label: 'Results' },
  { to: '/standings', label: 'Standings' },
  { to: '/watch', label: 'Watch' },
]

export default function Nav() {
  const [now, setNow] = useState(new Date())
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const utc = now.toISOString().slice(11, 19)
  const active = Math.max(0, links.findIndex((l) => l.to === location.pathname))

  return (
    <header className="sticky top-0 z-40 border-b-[1.5px] border-[var(--color-hairline)] bg-white">
      <div className="mx-auto flex max-w-none flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-3 md:px-10">
        <a href="/" className="flex items-center gap-2.5" translate="no">
          <span className="inline-block h-3 w-3 rotate-12 rounded-[4px] border-2 border-[var(--color-paper)] bg-[var(--color-signal)]" aria-hidden="true" />
          <span className="font-display text-xl font-extrabold tracking-tight text-[var(--color-paper)]">
            Grid Watch
          </span>
        </a>

        <div className="order-3 w-full md:order-none md:w-auto md:flex md:flex-1 md:justify-center">
          <SakugaTabs
            className="nav-tabs"
            label="Primary navigation"
            options={links.map((l) => ({ value: l.to, label: l.label }))}
            selected={active}
            onChange={(detail) => navigate(links[detail.index].to)}
          />
        </div>

        <div className="flex items-center gap-2 rounded-full border-[1.5px] border-[var(--color-hairline)] bg-[var(--color-panel-2)] px-3 py-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-paper-dim)]">UTC</span>
          <time className="tnum text-xs font-semibold text-[var(--color-paper)]">{utc}</time>
        </div>
      </div>
    </header>
  )
}
