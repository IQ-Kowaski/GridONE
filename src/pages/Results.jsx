import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePolling } from '../lib/usePolling'
import { fetchSchedule, fetchRaceResults, fetchQualifyingResults, fetchSprintResults } from '../lib/api'
import ResultsTable from '../components/ResultsTable'
import SakugaTabs from '../components/sakuga/SakugaTabs'
import SakugaProgress from '../components/sakuga/SakugaProgress'
import { SakugaSlider, SakugaRating } from '../components/sakuga/Controls'

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
  const { data: schedule, error: scheduleError } = usePolling(fetchSchedule, 5 * 60_000)
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
    <div className="mx-auto max-w-none px-6 py-12 md:px-10 md:py-16">
      <p className="sakuga-eyebrow mb-2">Session results</p>
      <h1 className="mb-8 text-4xl text-[var(--color-paper)] md:text-5xl">Results</h1>

      {scheduleError && (
        <p className="mb-6 text-sm font-semibold text-[var(--color-red-flag)]" role="alert">
          Couldn't reach the schedule feed. Retrying automatically…
        </p>
      )}

      <div className="mb-10 flex flex-wrap items-end gap-x-10 gap-y-6">
        <div>
          <SakugaSlider
            label="Round"
            min={1}
            max={schedule?.length ?? 23}
            value={round ?? 1}
            onChange={setRound}
          />
        </div>
        <div>
          <span className="sakuga-eyebrow">Rate this round</span>
          <SakugaRating label="Rate this round" value={0} />
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
