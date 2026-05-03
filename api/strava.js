export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

  try {
    // Refresh access token
    const tokenRes = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:     process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: process.env.STRAVA_REFRESH_TOKEN,
        grant_type:    'refresh_token',
      }),
    })
    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) throw new Error('Token refresh failed')
    const { access_token } = tokenData

    // Paginate through ALL activities
    const allActivities = []
    let page = 1
    while (true) {
      const r = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?per_page=200&page=${page}`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      const batch = await r.json()
      if (!Array.isArray(batch) || batch.length === 0) break
      allActivities.push(...batch)
      if (batch.length < 200) break
      page++
    }

    const runs = allActivities.filter(a => a.type === 'Run' || a.sport_type === 'Run')
    const thisYear = new Date().getFullYear()

    // ── All-time stats ────────────────────────────────────────────────
    const allKm        = runs.reduce((s, r) => s + r.distance / 1000, 0)
    const allElevation = runs.reduce((s, r) => s + (r.total_elevation_gain || 0), 0)
    const allSpeeds    = runs.filter(r => r.average_speed > 0).map(r => 1000 / r.average_speed / 60)
    const bestPaceAll  = allSpeeds.length ? Math.round(Math.min(...allSpeeds) * 100) / 100 : null
    const longestKm    = runs.length ? Math.round(Math.max(...runs.map(r => r.distance / 1000)) * 10) / 10 : 0

    // ── This-year stats ───────────────────────────────────────────────
    const runsThisYear  = runs.filter(r => new Date(r.start_date).getFullYear() === thisYear)
    const kmThisYear    = runsThisYear.reduce((s, r) => s + r.distance / 1000, 0)
    const elevThisYear  = runsThisYear.reduce((s, r) => s + (r.total_elevation_gain || 0), 0)
    const speedsThisYear = runsThisYear.filter(r => r.average_speed > 0).map(r => 1000 / r.average_speed / 60)
    const bestPaceYear  = speedsThisYear.length ? Math.round(Math.min(...speedsThisYear) * 100) / 100 : null
    const longestThisYear = runsThisYear.length ? Math.round(Math.max(...runsThisYear.map(r => r.distance / 1000)) * 10) / 10 : 0

    // ── Yearly totals bar chart ───────────────────────────────────────
    const yearMap = {}
    runs.forEach(r => {
      const y = new Date(r.start_date).getFullYear()
      if (!yearMap[y]) yearMap[y] = { year: String(y), km: 0, runs: 0 }
      yearMap[y].km   += r.distance / 1000
      yearMap[y].runs += 1
    })
    const yearlyKm = Object.values(yearMap)
      .sort((a, b) => a.year - b.year)
      .map(y => ({ ...y, km: Math.round(y.km) }))

    // ── Monthly km — last 12 months ───────────────────────────────────
    const now = new Date()
    const months = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
      months.push({ key, label, km: 0, goal: 50 })
    }
    runs.forEach(run => {
      const d = new Date(run.start_date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const m = months.find(m => m.key === key)
      if (m) m.km = Math.round((m.km + run.distance / 1000) * 10) / 10
    })
    const monthlyKm = months.map(({ label, km, goal }) => ({ month: label, km, goal }))

    // ── Pace trend — last 8 weeks with data ──────────────────────────
    const paceMap = {}
    runs.forEach(run => {
      if (run.average_speed <= 0) return
      const key = weekStart(new Date(run.start_date))
      const label = weekLabel(new Date(run.start_date))
      if (!paceMap[key]) paceMap[key] = { week: label, total: 0, count: 0 }
      paceMap[key].total += 1000 / run.average_speed / 60
      paceMap[key].count += 1
    })
    const paceData = Object.values(paceMap)
      .map(w => ({ week: w.week, pace: Math.round((w.total / w.count) * 100) / 100 }))
      .slice(-8)

    // ── Full run log (all runs, classified by distance) ───────────────
    const runLog = runs
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
      .map(r => {
        const km = Math.round(r.distance / 100) / 10
        const locationParts = [r.location_city, r.location_state, r.location_country].filter(Boolean)
        return {
          name: r.name,
          date: new Date(r.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          dist: km,
          time: fmtTime(r.moving_time),
          pace: r.average_speed > 0 ? Math.round((1000 / r.average_speed / 60) * 100) / 100 : null,
          type: classifyRun(km),
          location: locationParts.length ? locationParts.join(', ') : null,
        }
      })

    res.status(200).json({
      allTime: {
        totalKm:    Math.round(allKm),
        totalRuns:  runs.length,
        elevation:  Math.round(allElevation),
        longestKm,
        bestPace:   bestPaceAll,
      },
      thisYear: {
        km:        Math.round(kmThisYear),
        runs:      runsThisYear.length,
        elevation: Math.round(elevThisYear),
        longestKm: longestThisYear,
        bestPace:  bestPaceYear,
      },
      yearlyKm,
      monthlyKm,
      paceData,
      runLog,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

function classifyRun(km) {
  if (km < 5)    return 'Recovery'
  if (km < 8)    return 'Easy Run'
  if (km < 13)   return 'Base Run'
  if (km < 20.5) return 'Long Run'
  if (km < 22)   return 'Half Marathon'
  if (km < 41.5) return 'Very Long Run'
  if (km < 43.5) return 'Marathon'
  return 'Ultra'
}

function weekStart(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d.toISOString().slice(0, 10)
}

function weekLabel(date) {
  const d = new Date(date)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function fmtTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`
}
