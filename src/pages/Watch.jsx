import { usePolling } from '../lib/usePolling'
import { fetchSchedule } from '../lib/api'
import { getStreamsForSession } from '../lib/streamProvider'
import { useEffect, useState } from 'react'
import StreamPlayer from '../components/StreamPlayer'
import LiveBadge from '../components/LiveBadge'
import Countdown from '../components/Countdown'
import SakugaTooltip from '../components/sakuga/SakugaTooltip'
import SakugaProgress from '../components/sakuga/SakugaProgress'
import { formatSessionTime } from '../lib/format'

function currentOrNextSession(schedule) {
  const now = Date.now()
  const all = schedule.flatMap((r) => r.sessions.map((s) => ({ ...s, race: r })))
  const live = all.find((s) => s.at && now - s.at.getTime() > -15 * 60_000 && now - s.at.getTime() < 3 * 3600_000)
  if (live) return { session: live, isLive: true }
  const upcoming = all.filter((s) => s.at && s.at.getTime() > now).sort((a, b) => a.at - b.at)[0]
  return { session: upcoming ?? null, isLive: false }
}

export default function Watch() {
  const { data: schedule, loading, error } = usePolling(fetchSchedule, 5 * 60_000)
  const [feeds, setFeeds] = useState(null)

  const result = schedule ? currentOrNextSession(schedule) : null
  const session = result?.session ?? null
  const isLive = result?.isLive ?? false

  useEffect(() => {
    let cancelled = false
    if (!session) return
    setFeeds(null)
    getStreamsForSession(`${session.race.round}-${session.label}`, session.race.name).then((f) => {
      if (!cancelled) setFeeds(f)
    })
    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.race?.round, session?.label])

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <p className="sakuga-eyebrow mb-2">Live coverage</p>
      <h1 className="mb-8 text-4xl text-[var(--color-paper)] md:text-5xl">Watch</h1>

      {error && (
        <p className="mb-6 text-sm font-semibold text-[var(--color-red-flag)]" role="alert">
          Couldn't reach the schedule feed. Retrying automatically…
        </p>
      )}

      {loading && !schedule && (
        <div className="sakuga-card flex min-h-64 items-center justify-center p-8">
          <SakugaProgress label="Loading coverage" />
        </div>
      )}

      {schedule && !session && (
        <p className="text-sm text-[var(--color-paper-dim)]">No upcoming sessions found.</p>
      )}

      {session && (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                {isLive && <LiveBadge />}
                <h2 className="text-2xl text-[var(--color-paper)]">
                  {session.race.name} · {session.label}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-[var(--color-paper-dim)]">
                  {session.race.circuit} · {formatSessionTime(session.at)}
                </p>
                <SakugaTooltip
                  label="About session times"
                  text="Times are shown in your local timezone."
                />
              </div>
            </div>
            {!isLive && <Countdown target={session.at} />}
          </div>

          {feeds === null ? (
            <div className="sakuga-card flex min-h-64 items-center justify-center p-8">
              <SakugaProgress label="Finding streams" />
            </div>
          ) : (
            <StreamPlayer feeds={feeds} sessionLabel={`${session.race.name} · ${session.label}`} />
          )}
        </>
      )}
    </div>
  )
}
