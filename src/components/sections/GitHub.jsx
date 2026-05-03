import React, { useState, useEffect } from 'react'

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Shell:      '#89e051',
  Jupyter:    '#DA5B0B',
  R:          '#198CE7',
}

const USERNAME = 'dannrebolledo'

export default function GitHub() {
  const [repos, setRepos]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [activeLang, setLang]     = useState('All')

  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`, { headers })
      .then(r => {
        if (!r.ok) throw new Error(r.status === 403 ? 'Rate limit reached — try again in a minute' : 'Failed to load repos')
        return r.json()
      })
      .then(data => { setRepos(data.filter(r => !r.fork)); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const languages = ['All', ...Array.from(new Set(repos.map(r => r.language).filter(Boolean))).sort()]

  const filtered = activeLang === 'All'
    ? repos
    : repos.filter(r => r.language === activeLang)

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">GitHub</h1>
        <p className="section-subtitle">
          I'm not a software engineer by training, but I've been writing code long enough to have opinions about it.
          Most of what you'll find here is Python, data pipelines, and the occasional React experiment that got out of hand — like this portfolio.
          Everything's public, everything's a work in progress, and I'm always open to a better way of doing things.
          Find me at{' '}
          <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 500 }}>
            @{USERNAME}
          </a>.
        </p>
      </div>

      {loading && (
        <div className="github-loading">
          <div className="spinner" />
          <p>Fetching repositories…</p>
        </div>
      )}

      {error && (
        <div className="github-error">
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="github-filters">
            {languages.map(lang => (
              <button
                key={lang}
                className={`lang-filter${activeLang === lang ? ' active' : ''}`}
                onClick={() => setLang(lang)}
              >
                {lang !== 'All' && (
                  <span
                    className="lang-dot"
                    style={{ background: LANG_COLORS[lang] || '#ccc' }}
                  />
                )}
                {lang}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="github-empty">
              <p>No repositories for this language.</p>
            </div>
          ) : (
            <div className="repos-grid">
              {filtered.map(repo => (
                <div key={repo.id} className="repo-card">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="repo-name"
                  >
                    {repo.name}
                  </a>
                  <p className="repo-desc">
                    {repo.description || <em style={{ opacity: 0.6 }}>No description</em>}
                  </p>
                  <div className="repo-footer">
                    {repo.language && (
                      <span className="repo-lang">
                        <span
                          className="lang-dot"
                          style={{ background: LANG_COLORS[repo.language] || '#ccc' }}
                        />
                        {repo.language}
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="repo-stat">
                        <span>★</span> {repo.stargazers_count}
                      </span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className="repo-stat">
                        <span>⑂</span> {repo.forks_count}
                      </span>
                    )}
                    <span className="repo-stat" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                      {new Date(repo.updated_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
