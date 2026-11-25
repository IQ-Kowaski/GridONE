import { useState } from 'react'
import { usePolling } from '../lib/usePolling'
import { fetchDriverStandings, fetchConstructorStandings } from '../lib/api'
import StandingsTable from '../components/StandingsTable'
import SakugaProgress from '../components/sakuga/SakugaProgress'
import { SakugaInput, SakugaRadio } from '../components/sakuga/Controls'

function TableSkeleton({ label }) {
  return (
    <div className="sakuga-card flex min-h-64 items-center justify-center p-8">
      <SakugaProgress label={label} />
    </div>
  )
}

function prepare(rows, query, sort) {
  const q = query.trim().toLowerCase()
  const filtered = rows?.filter((r) =>
    !q || [r.name, r.constructor, r.nationality].some((v) => v?.toLowerCase().includes(q))
  ) ?? []
  return [...filtered].sort((a, b) => sort === 'wins' ? b.wins - a.wins : b.points - a.points)
}

export default function Standings() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('points')
  const { data: drivers, loading: dLoading, error: dError, updatedAt } = usePolling(
    fetchDriverStandings,
    5 * 60_000
  )
  const { data: constructors, loading: cLoading, error: cError } = usePolling(
    fetchConstructorStandings,
    5 * 60_000
  )

  const shownDrivers = drivers ? prepare(drivers, query, sort) : null
  const shownConstructors = constructors ? prepare(constructors, query, sort) : null

  return (
    <div className="mx-auto max-w-none px-6 py-12 md:px-10 md:py-16">
      <p className="sakuga-eyebrow mb-2">Championship points</p>
      <h1 className="mb-2 text-4xl text-[var(--color-paper)] md:text-5xl">Standings</h1>
      {updatedAt && (
        <p className="mb-6 text-xs font-semibold text-[var(--color-paper-dim)]">
          Updated {updatedAt.toLocaleTimeString()} · refreshes automatically
        </p>
      )}

      <div className="mb-10 flex flex-wrap items-end gap-x-10 gap-y-6">
        <div>
          <span className="sakuga-eyebrow">Find a driver or team</span>
          <SakugaInput label="Find" placeholder="Type a name…" value={query} onChange={setQuery} />
        </div>
        <div>
          <span className="sakuga-eyebrow">Sort by</span>
          <SakugaRadio
            label="Sort standings"
            options={[{ value: 'points', label: 'Points' }, { value: 'wins', label: 'Wins' }]}
            value={sort}
            onChange={setSort}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {dError && <p className="text-sm font-semibold text-[var(--color-red-flag)]">Couldn't load driver standings.</p>}
        {dLoading && !drivers ? (
          <TableSkeleton label="Loading driver standings" />
        ) : (
          shownDrivers && (
            <StandingsTable
              title="Drivers"
              rows={shownDrivers}
              renderPrimary={(r) => r.name}
              renderSecondary={(r) => r.constructor}
            />
          )
        )}

        {cError && <p className="text-sm font-semibold text-[var(--color-red-flag)]">Couldn't load constructor standings.</p>}
        {cLoading && !constructors ? (
          <TableSkeleton label="Loading constructor standings" />
        ) : (
          shownConstructors && (
            <StandingsTable
              title="Constructors"
              rows={shownConstructors}
              renderPrimary={(r) => r.name}
              renderSecondary={(r) => r.nationality}
            />
          )
        )}
      </div>
    </div>
  )
}
