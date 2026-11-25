import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Countdown from '../components/Countdown'
import LiveBadge from '../components/LiveBadge'
import SakugaButton from '../components/sakuga/SakugaButton'
import { usePolling } from '../lib/usePolling'
import { fetchSchedule, fetchDriverStandings, deriveLiveSession } from '../lib/api'
import { formatSessionTime } from '../lib/format'
import { driverImg, initials } from '../lib/driverAssets'

const TONES = [
  { bg: '#f4f3fc', ink: '#5a4fd8' },
  { bg: '#b8b3ff', ink: '#1d1a4a' },
  { bg: '#ffd1e6', ink: '#1d1a4a' },
  { bg: '#8f8df7', ink: '#1d1a4a' },
  { bg: '#dcdaf0', ink: '#1d1a4a' },
]

function DriverCard({ driver: d, index, leaderPoints }) {
  const imgUrl = driverImg(d.code)
  const tone = TONES[(d.position - 1) % TONES.length]
  const share = Math.min(100, leaderPoints > 0 ? (d.points / leaderPoints) * 100 : 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="sakuga-card group relative p-4"
    >
      <span
        className={`tnum absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-extrabold ${
          d.position === 1 ? 'bg-[var(--color-signal)] text-white' : 'border-2 border-[var(--color-hairline)] bg-white text-[var(--color-paper-dim)]'
        }`}
      >
        {d.position}
      </span>

      <div className="mb-3 flex justify-center pt-2">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={d.name}
            className="h-16 w-16 rounded-full border-[2.5px] border-[var(--color-paper)] object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full border-[2.5px] border-[var(--color-paper)] transition-transform group-hover:scale-105"
            style={{ backgroundColor: tone.bg }}
          >
            <span className="text-sm font-extrabold tracking-wide" style={{ color: tone.ink }}>
              {initials(d.name)}
            </span>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="truncate font-display text-lg font-extrabold text-[var(--color-paper)]">{d.code}</p>
        <p className="truncate text-xs text-[var(--color-paper-dim)]">{d.constructor}</p>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 border-t-[1.5px] border-[var(--color-hairline)] pt-2.5">
        <div className="h-2 w-12 overflow-hidden rounded-full border-[1.5px] border-[var(--color-hairline)] bg-white">
          <div className="h-full rounded-full bg-[var(--color-signal-dim)]" style={{ width: `${share}%` }} />
        </div>
        <span className="tnum text-sm font-extrabold" style={{ color: tone.ink }}>
          {d.points}
        </span>
      </div>
    </motion.div>
  )
}

function nextSession(schedule) {
  const now = Date.now()
  const all = schedule.flatMap((r) => r.sessions.map((s) => ({ ...s, race: r })))
  const upcoming = all.filter((s) => s.at && s.at.getTime() > now).sort((a, b) => a.at - b.at)
  return upcoming[0] ?? null
}

export default function Home() {
  const navigate = useNavigate()
  const { data: schedule, loading: loadingSchedule, error: scheduleError } = usePolling(
    fetchSchedule,
    5 * 60_000
  )
  const { data: drivers } = usePolling(fetchDriverStandings, 5 * 60_000)

  const session = schedule ? nextSession(schedule) : null
  const isLive = schedule ? !!deriveLiveSession(schedule) : false

  return (
    <>
      <Hero nextRace={session?.race}>
        {scheduleError && (
          <p className="mb-4 text-sm font-semibold text-[var(--color-red-flag)]" role="alert">
            Couldn't reach the schedule feed. Retrying automatically…
          </p>
        )}

        {loadingSchedule && !schedule && (
          <p className="text-sm text-[var(--color-paper-dim)]">Loading session clock…</p>
        )}

        {session && (
          <div>
            <div className="mb-3 flex items-center gap-3">
              {isLive && <LiveBadge />}
              <span className="font-display text-lg font-extrabold text-[var(--color-paper)]">
                {session.label} · {formatSessionTime(session.at)}
              </span>
            </div>
            <Countdown target={session.at} />
          </div>
        )}

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <SakugaButton variant="secondary" onClick={() => navigate('/watch')}>
            {isLive ? 'Watch live' : 'Watch'}
          </SakugaButton>
          <SakugaButton onClick={() => navigate('/schedule')}>Full race calendar</SakugaButton>
          <SakugaButton variant="secondary" onClick={() => navigate('/standings')}>
            Championship standings
          </SakugaButton>
        </div>
      </Hero>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-3xl text-[var(--color-paper)] md:text-4xl">
            Drivers' Championship
          </h2>
          <Link
            to="/standings"
            className="shrink-0 text-sm font-bold text-[var(--color-signal)] underline decoration-2 underline-offset-4 hover:text-[var(--color-paper)]"
          >
            View full table →
          </Link>
        </div>

        {!drivers && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="sakuga-card h-44 animate-pulse" />
            ))}
          </div>
        )}

        {drivers && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {drivers.slice(0, 5).map((d, i) => (
              <DriverCard key={d.driverId} driver={d} index={i} leaderPoints={drivers[0]?.points ?? 1} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
