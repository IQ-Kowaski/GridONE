import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePolling } from '../lib/usePolling'
import { fetchSchedule, fetchRaceResults, fetchQualifyingResults, fetchSprintResults } from '../lib/api'
import ResultsTable from '../components/ResultsTable'
import SakugaTabs from '../components/sakuga/SakugaTabs'
import SakugaProgress from '../components/sakuga/SakugaProgress'

const SESSIONS = [
  { key: 'race', label: 'Race', fetcher: fetchRaceResults },
  { key: 'qualifying', label: 'Qualifying', fetcher: fetchQualifyingResults },
  { key: 'sprint', label: 'Sprint', fetcher: fetchSprintResults },
]

function TableSkeleton() {
  return (
    <div className="sakuga-card flex min-h-64 items-center justify-center p-8">
      <SakugaProgress label="Loading session results" />
    </div>
  )
}

export default function Results() {
  const { data: schedule, loading: scheduleLoading, error: scheduleError } = usePolling(fetchSchedule, 5 * 60_000)
  const [round, setRound] = useState(null)
  const [session, setSession] = useState('race')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!schedule || schedule.length === 0) return
    const latest = [...schedule].reverse().find((r) => {
      const raceSession = r.sessions.find((s) => s.label === 'Race')
      return raceSession && raceSession.at.getTime() < Date.now()
    })
    setRound(latest?.round ?? schedule[schedule.length - 1]?.round)
  }, [schedule])

  useEffect(() => {
    if (!round) return
    const active = SESSIONS.find((s) => s.key === session)
    if (!active) return
    let cancelled = false
    setLoading(true)
    setError(null)
    active.fetcher(round).then((data) => {
      if (!cancelled) {
        setResults(data)
        setLoading(false)
      }
    }).catch((e) => {
      if (!cancelled) {
        setError(e.message)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [round, session])

  const selectedRound = schedule?.find((r) => r.round === round)

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <p className="sakuga-eyebrow mb-2">Session results</p>
      <h1 className="mb-8 text-4xl text-[var(--color-paper)] md:text-5xl">Results</h1>

      {scheduleError && (
        <p className="mb-6 text-sm font-semibold text-[var(--color-red-flag)]" role="alert">
          Couldn't reach the schedule feed. Retrying automatically…
        </p>
      )}

      <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-5">
        <div className="relative">
          <select
            value={round ?? ''}
            onChange={(e) => setRound(Number(e.target.value))}
            className="appearance-none rounded-full border-[2.5px] border-[var(--color-paper)] bg-white px-4 py-2 pr-10 text-sm font-bold text-[var(--color-paper)] shadow-[4px_5px_0_var(--color-soft)] focus:outline-none focus-visible:border-[var(--color-signal)]"
          >
            {scheduleLoading && <option value="">Loading rounds…</option>}
            {schedule?.map((r) => {
              const raceSession = r.sessions.find((s) => s.label === 'Race')
              const isPast = raceSession && raceSession.at.getTime() < Date.now()
              return (
                <option key={r.round} value={r.round} disabled={!isPast}>
                  R{r.round.toString().padStart(2, '0')} — {r.name}
                </option>
              )
            })}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-paper-dim)]"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        <SakugaTabs
          label="Session"
          options={SESSIONS.map((s) => ({ value: s.key, label: s.label }))}
          selected={SESSIONS.findIndex((s) => s.key === session)}
          onChange={(detail) => setSession(detail.value)}
        />
      </div>

      {selectedRound && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl text-[var(--color-paper)] md:text-3xl">
            {selectedRound.name}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-paper-dim)]">
            {selectedRound.circuit} · {selectedRound.locality}, {selectedRound.country}
          </p>
        </motion.div>
      )}

      {error && (
        <p className="mb-6 text-sm font-semibold text-[var(--color-red-flag)]" role="alert">
          Couldn't load results for this round.
        </p>
      )}

      {loading && <TableSkeleton />}

      {!loading && results && results.length === 0 && (
        <div className="sakuga-card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <p className="text-sm text-[var(--color-paper-dim)]">
            No results available yet for this session.
          </p>
        </div>
      )}

      {!loading && results && results.length > 0 && (
        <ResultsTable
          title={SESSIONS.find((s) => s.key === session)?.label ?? ''}
          rows={results}
          sessionType={session}
        />
      )}
    </div>
  )
}
