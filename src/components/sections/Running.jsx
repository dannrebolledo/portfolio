import React, { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'

const MOCK_DATA = {
  allTime:  { totalKm: 1240, totalRuns: 180, elevation: 9800, longestKm: 42.2, bestPace: 4.85 },
  thisYear: { km: 312, runs: 48, elevation: 2400, longestKm: 21.1, bestPace: 5.05 },
  yearlyKm: [
    { year: '2022', km: 280, runs: 42 },
    { year: '2023', km: 480, runs: 72 },
    { year: '2024', km: 168, runs: 24 },
    { year: '2025', km: 312, runs: 42 },
  ],
  monthlyKm: [
    { month: 'May 24', km: 22, goal: 50 }, { month: 'Jun 24', km: 18, goal: 50 },
    { month: 'Jul 24', km: 35, goal: 50 }, { month: 'Aug 24', km: 48, goal: 50 },
    { month: 'Sep 24', km: 41, goal: 50 }, { month: 'Oct 24', km: 32, goal: 50 },
    { month: 'Nov 24', km: 28, goal: 50 }, { month: 'Dec 24', km: 15, goal: 50 },
    { month: 'Jan 25', km: 38, goal: 50 }, { month: 'Feb 25', km: 45, goal: 50 },
    { month: 'Mar 25', km: 52, goal: 50 }, { month: 'Apr 25', km: 39, goal: 50 },
  ],
  paceData: [
    { week: 'W1', pace: 5.75 }, { week: 'W2', pace: 5.83 }, { week: 'W3', pace: 5.63 },
    { week: 'W4', pace: 5.52 }, { week: 'W5', pace: 5.42 }, { week: 'W6', pace: 5.35 },
    { week: 'W7', pace: 5.37 }, { week: 'W8', pace: 5.20 },
  ],
  runLog: [
    { name: 'Barcelona Marathon',      date: '16 Mar 2025', dist: 42.2,  time: '4:01:45', pace: 5.73, type: 'Marathon',      location: 'Barcelona, Catalonia, Spain' },
    { name: 'Sunday long run',         date: '9 Mar 2025',  dist: 21.0,  time: '1:52:10', pace: 5.34, type: 'Half Marathon',  location: 'London, England, United Kingdom' },
    { name: 'Great North Run',         date: '8 Sep 2024',  dist: 21.1,  time: '1:49:12', pace: 5.21, type: 'Half Marathon',  location: 'Newcastle, England, United Kingdom' },
    { name: 'Easy morning run',        date: '22 Aug 2024', dist: 7.4,   time: '40:12',   pace: 5.43, type: 'Easy Run',       location: 'London, England, United Kingdom' },
    { name: 'Edinburgh Half Marathon', date: '26 May 2024', dist: 21.1,  time: '1:52:34', pace: 5.32, type: 'Half Marathon',  location: 'Edinburgh, Scotland, United Kingdom' },
    { name: 'Park run',                date: '4 May 2024',  dist: 5.0,   time: '24:45',   pace: 4.95, type: 'Easy Run',       location: 'London, England, United Kingdom' },
    { name: 'Long run',                date: '21 Apr 2024', dist: 15.2,  time: '1:24:30', pace: 5.56, type: 'Long Run',       location: 'London, England, United Kingdom' },
  ],
}

const fmtPace = (val) => {
  if (!val) return '—'
  const m = Math.floor(val)
  const s = Math.round((val - m) * 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

const fmtKm  = (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)

const TYPE_STYLES = {
  'Recovery':      { bg: '#dbeafe', color: '#1e40af' },
  'Easy Run':      { bg: '#d1fae5', color: '#065f46' },
  'Base Run':      { bg: '#fef3c7', color: '#92400e' },
  'Long Run':      { bg: '#ffedd5', color: '#9a3412' },
  'Half Marathon': { bg: '#e8cdb9', color: '#7d3e24' },
  'Very Long Run': { bg: '#fecaca', color: '#991b1b' },
  'Marathon':      { bg: '#9b4f2e', color: '#fff'    },
  'Ultra':         { bg: '#2c1810', color: '#fff'    },
}

function RunTypeBadge({ type }) {
  const s = TYPE_STYLES[type] || { bg: 'var(--accent-muted)', color: 'var(--accent)' }
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.15rem 0.55rem',
      borderRadius: '100px',
      fontSize: '0.7rem',
      fontWeight: 600,
      background: s.bg,
      color: s.color,
      whiteSpace: 'nowrap',
    }}>
      {type}
    </span>
  )
}

const TICK = { fontFamily: 'var(--font-body)', fill: 'var(--text-muted)', fontSize: 11 }
const GRID = { stroke: 'var(--border)', strokeDasharray: '4 4' }

const KmTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.65rem 0.9rem', fontSize: '0.8rem' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name === 'km' ? 'Volume' : 'Monthly target'}: <strong>{p.value} km</strong>
        </div>
      ))}
    </div>
  )
}

const YearTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.65rem 0.9rem', fontSize: '0.8rem' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--accent)' }}>Total: <strong>{payload[0].value} km</strong></div>
      {payload[1] && <div style={{ color: 'var(--text-muted)' }}>Runs: <strong>{payload[1].value}</strong></div>}
    </div>
  )
}

const PaceTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.65rem 0.9rem', fontSize: '0.8rem' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--accent)' }}>Avg pace: <strong>{fmtPace(payload[0].value)}/km</strong></div>
    </div>
  )
}

function StatCard({ value, label, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--accent-light)', marginTop: '0.2rem' }}>{sub}</div>}
    </div>
  )
}

function StatSection({ title, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
        {title}
      </div>
      <div className="stats-row">{children}</div>
    </div>
  )
}

export default function Running() {
  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [live, setLive]           = useState(false)
  const [typeFilter, setTypeFilter] = useState('All')
  const [showCount, setShowCount]   = useState(20)
  const thisYearLabel               = new Date().getFullYear()

  useEffect(() => {
    fetch('/api/strava')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setData(d); setLive(true) })
      .catch(() => setData(MOCK_DATA))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="github-loading" style={{ paddingTop: '5rem' }}>
      <div className="spinner" />
      <p>Loading Strava data…</p>
    </div>
  )

  const { allTime, thisYear, yearlyKm, monthlyKm, paceData, runLog = [] } = data
  const currentYear = String(thisYearLabel)

  return (
    <div>
      <div className="section-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h1 className="section-title">Running</h1>
          <p className="section-subtitle">All my runs, live from Strava. Yes, I track everything. No, it doesn't always make me faster.</p>
        </div>
        <span className={`badge ${live ? 'badge-green' : 'badge-amber'}`} style={{ marginTop: '0.35rem' }}>
          {live ? '● Live from Strava' : '○ Preview data'}
        </span>
      </div>

      {/* All-time KPIs */}
      <StatSection title="All Time">
        <StatCard value={fmtKm(allTime.totalKm)}  label="Total km" />
        <StatCard value={allTime.totalRuns}        label="Total runs" />
        <StatCard value={fmtKm(allTime.elevation)} label="Elevation (m)" />
        <StatCard value={`${allTime.longestKm} km`} label="Longest run" />
        <StatCard value={`${fmtPace(allTime.bestPace)}/km`} label="Best avg pace" />
      </StatSection>

      {/* This year KPIs */}
      <StatSection title={`${thisYearLabel}`}>
        <StatCard value={`${thisYear.km} km`}     label="Distance" />
        <StatCard value={thisYear.runs}            label="Runs" />
        <StatCard value={fmtKm(thisYear.elevation)} label="Elevation (m)" />
        <StatCard value={`${thisYear.longestKm} km`} label="Longest run" />
        <StatCard value={`${fmtPace(thisYear.bestPace)}/km`} label="Best avg pace" />
      </StatSection>

      {/* Yearly totals chart */}
      {yearlyKm.length > 1 && (
        <div className="chart-card" style={{ marginBottom: '1.5rem' }}>
          <div className="chart-title">Yearly Distance</div>
          <div className="chart-hint">Total km per calendar year</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yearlyKm} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="year" tick={TICK} />
              <YAxis tick={TICK} tickFormatter={fmtKm} />
              <Tooltip content={<YearTooltip />} />
              <Bar dataKey="km" radius={[4, 4, 0, 0]} maxBarSize={60}>
                {yearlyKm.map(entry => (
                  <Cell
                    key={entry.year}
                    fill={entry.year === currentYear ? '#9b4f2e' : '#e8cdb9'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weekly + pace charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">Monthly Volume — Last 12 Months</div>
          <div className="chart-hint">km/month vs. target</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyKm} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="kmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#9b4f2e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#9b4f2e" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="month" tick={TICK} />
              <YAxis tick={TICK} domain={[0, 50]} />
              <Tooltip content={<KmTooltip />} />
              <Area type="monotone" dataKey="goal" stroke="#ddd0c4" fill="none" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="km"   stroke="#9b4f2e" fill="url(#kmGrad)" strokeWidth={2} dot={{ fill: '#9b4f2e', r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Average Pace Trend</div>
          <div className="chart-hint">min/km — lower is faster</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={paceData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid {...GRID} />
              <XAxis dataKey="week" tick={TICK} />
              <YAxis tick={{ ...TICK, fontSize: 10 }} tickFormatter={fmtPace} domain={['auto', 'auto']} />
              <Tooltip content={<PaceTooltip />} />
              <ReferenceLine y={5.5} stroke="#e8cdb9" strokeDasharray="4 4" label={{ value: '5:30 target', fill: 'var(--text-muted)', fontSize: 10 }} />
              <Bar dataKey="pace" fill="#9b4f2e" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {runLog.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            <h2 className="race-log-title" style={{ marginBottom: 0 }}>Run Log</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{runLog.length} activities</span>
          </div>

          {/* Type filter chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {['All', ...Array.from(new Set(runLog.map(r => r.type)))].map(t => (
              <button
                key={t}
                onClick={() => { setTypeFilter(t); setShowCount(20) }}
                style={{
                  padding: '0.25rem 0.7rem',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  border: '1px solid var(--border)',
                  background: typeFilter === t ? 'var(--accent)' : 'var(--bg-card)',
                  color:      typeFilter === t ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <table className="race-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Type</th>
                <th>Distance</th>
                <th>Time</th>
                <th>Pace</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {runLog
                .filter(r => typeFilter === 'All' || r.type === typeFilter)
                .slice(0, showCount)
                .map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{r.date}</td>
                    <td><RunTypeBadge type={r.type} /></td>
                    <td><span className="race-time">{r.dist} km</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.time}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{r.pace ? `${fmtPace(r.pace)}/km` : '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{r.location || '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {runLog.filter(r => typeFilter === 'All' || r.type === typeFilter).length > showCount && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button className="btn btn-ghost" onClick={() => setShowCount(n => n + 20)}>
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
