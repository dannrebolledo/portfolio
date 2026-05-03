import React, { useState } from 'react'

const ADMIN_PASSWORD = 'dan123'

export default function Sidebar({ sections, current, onNavigate, isAdmin, onAdminChange, isOpen }) {
  const [showLogin, setShowLogin] = useState(false)
  const [pwd, setPwd]             = useState('')
  const [error, setError]         = useState(false)

  const handleLogin = () => {
    if (pwd === ADMIN_PASSWORD) {
      onAdminChange(true)
      setShowLogin(false)
      setPwd('')
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 1800)
    }
  }

  return (
    <nav className={`sidebar${isOpen ? ' open' : ''}`}>
      <div className="sidebar-brand">
        <h2>Daniel<br />Rebolledo</h2>
        <p>People Analytics</p>
      </div>

      <div className="sidebar-nav">
        {sections.map(s => (
          <button
            key={s.id}
            className={`nav-item${current === s.id ? ' active' : ''}`}
            onClick={() => onNavigate(s.id)}
          >
            <span className="nav-icon">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        {isAdmin ? (
          <div>
            <span className="badge badge-admin" style={{ marginBottom: '0.6rem', display: 'inline-flex' }}>
              ✦ Admin
            </span>
            <button
              className="nav-item"
              style={{ fontSize: '0.78rem' }}
              onClick={() => onAdminChange(false)}
            >
              <span className="nav-icon">↩</span>
              Sign out
            </button>
          </div>
        ) : showLogin ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              className={`input${error ? ' input-error' : ''}`}
              type="password"
              placeholder="Password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={handleLogin}>
                Login
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => { setShowLogin(false); setPwd('') }}>
                ✕
              </button>
            </div>
            {error && <span style={{ fontSize: '0.72rem', color: '#c0392b' }}>Incorrect password</span>}
          </div>
        ) : (
          <button
            className="nav-item"
            style={{ fontSize: '0.78rem' }}
            onClick={() => setShowLogin(true)}
          >
            <span className="nav-icon">⚙</span>
            Admin
          </button>
        )}
      </div>
    </nav>
  )
}
