import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePolling } from '../lib/usePolling'
import { fetchSchedule, deriveLiveSession } from '../lib/api'
import { formatSessionTime } from '../lib/format'
import LiveBadge from '../components/LiveBadge'
import SakugaProgress from '../components/sakuga/SakugaProgress'
import { SakugaCheckbox } from '../components/sakuga/Controls'

export default function Schedule() {
  const [showPast, setShowPast] = useState(false)
  const { data: schedule, loading, error } = usePolling(fetchSchedule, 5 * 60_000)
  const isLive = schedule ? !!deriveLiveSession(schedule) : false
  const now = Date.now()

  const visible = schedule?.filter((race) => {
    if (showPast) return true
    const raceSession = race.sessions.find((s) => s.label === 'Race')
    return !raceSession || raceSession.at.getTime() >= now
  })

  return (
    <div className="mx-auto max-w-none px-6 py-12 md:px-10 md:py-16">
      <p className="sakuga-eyebrow mb-2">Season calendar</p>
      <h1 className="mb-6 text-4xl text-[var(--color-paper)] md:text-5xl">Race Schedule</h1>

      <div className="mb-8">
        <SakugaCheckbox checked={showPast} onChange={setShowPast}>
          Show past rounds
        </SakugaCheckbox>
      </div>

      {error && (
        <p className="mb-6 text-sm font-semibold text-[var(--color-red-flag)]" role="alert">
          Couldn't reach the schedule feed. Retrying automatically…
        </p>
      )}

      {loading && !schedule && (
        <div className="sakuga-card flex min-h-64 items-center justify-center p-8">
          <SakugaProgress label="Loading race calendar" />
        </div>
      )}

      <ol className="space-y-4">
        {visible?.map((race, i) => {
          const raceSession = race.sessions.find((s) => s.label === 'Race')
          const isPast = raceSession && raceSession.at.getTime() < now
          const isThisRaceLive = isLive && !isPast && raceSession && now - raceSession.at.getTime() > -3 * 3600_000

          return (
            <motion.li
              key={race.round}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26, delay: Math.min(i, 10) * 0.025 }}
              className={`sakuga-card p-4 md:p-5 ${isPast ? 'bg-[var(--color-panel-2)]' : ''}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="tnum rounded-full border-[1.5px] border-[var(--color-hairline)] bg-white px-2 py-0.5 text-[11px] font-bold text-[var(--color-paper-dim)]">
                      RD {String(race.round).padStart(2, '0')}
                    </span>
                    {isThisRaceLive && <LiveBadge />}
                  </div>
                  <h2 className="text-xl text-[var(--color-paper)] md:text-2xl">{race.name}</h2>
                  <p className="text-sm text-[var(--color-paper-dim)]">
                    {race.circuit} · {race.locality}, {race.country}
                  </p>
                </div>
                {raceSession && (
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-paper-dim)]">
                      Race start
                    </p>
                    <p className="tnum font-display text-lg font-extrabold text-[var(--color-paper)]">
                      {formatSessionTime(raceSession.at)}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {race.sessions.map((s) => (
                  <span
                    key={s.label}
                    className="rounded-full border-[1.5px] border-[var(--color-hairline)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--color-paper-dim)]"
                  >
                    {s.label}: <span className="tnum text-[var(--color-paper)]">{formatSessionTime(s.at)}</span>
                  </span>
                ))}
              </div>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
