import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/results', label: 'Results' },
  { to: '/standings', label: 'Standings' },
  { to: '/watch', label: 'Watch' },
]

export default function Nav() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const utc = now.toISOString().slice(11, 19)

  return (
    <header className="sticky top-0 z-40 border-b-[1.5px] border-[var(--color-hairline)] bg-white">
      <div className="mx-auto flex max-w-none items-center justify-between px-6 py-3 md:px-10">
        <a href="/" className="flex items-center gap-2.5" translate="no">
          <span className="inline-block h-3 w-3 rotate-12 rounded-[4px] border-2 border-[var(--color-paper)] bg-[var(--color-signal)]" aria-hidden="true" />
          <span className="font-display text-xl font-extrabold tracking-tight text-[var(--color-paper)]">
            Grid Watch
          </span>
        </a>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[var(--color-panel-2)] text-[var(--color-signal)]'
                    : 'text-[var(--color-paper-dim)] hover:bg-[var(--color-panel-2)] hover:text-[var(--color-paper)]'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden rounded-full border-[1.5px] border-[var(--color-hairline)] bg-[var(--color-panel-2)] px-3 py-1 sm:flex sm:items-center sm:gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-paper-dim)]">UTC</span>
          <time className="tnum text-xs font-semibold text-[var(--color-paper)]">{utc}</time>
        </div>
      </div>

      <nav className="flex items-center gap-5 overflow-x-auto border-t-[1.5px] border-[var(--color-hairline)] px-6 py-2 md:hidden" aria-label="Primary">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `shrink-0 text-sm font-semibold ${isActive ? 'text-[var(--color-signal)]' : 'text-[var(--color-paper-dim)]'}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
