import React from 'react'

const NAV_CARDS = [
  {
    id: 'cv',
    icon: '📋',
    title: 'CV & Journey',
    desc: 'From Industrial Engineering in Santiago to AI workforce scheduling at Warwick — an interactive timeline of how People Analytics and Workforce Management became my thing.',
  },
  {
    id: 'projects',
    icon: '🚀',
    title: 'Projects',
    desc: 'Side projects and open-source work: a Strava dashboard, a People Analytics Python toolkit, and this portfolio.',
  },
  {
    id: 'github',
    icon: '💻',
    title: 'GitHub',
    desc: "Live view of my public repositories — filter by language and explore what I've been building.",
  },
  {
    id: 'running',
    icon: '🏃',
    title: 'Running',
    desc: 'Real training data pulled from Strava — monthly volume, pace trends, and a full race log.',
  },
  {
    id: 'about',
    icon: '💬',
    title: 'About & Blog',
    desc: 'More about me, writing on People Analytics and Workforce Management, and an AI assistant you can chat with.',
  },
]

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/dannrebolledo',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/danielrebmunoz',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:rebolledomunozdaniel@gmail.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
      </svg>
    ),
  },
]

export default function Home({ onNavigate }) {
  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <p className="hero-eyebrow">Hello, I'm</p>
        <h1 className="hero-name">Daniel<br />Rebolledo</h1>
        <p className="hero-tagline">
          People Analytics meets Workforce Management —<br />I make both count.
        </p>
        <div className="hero-tags">
          <span className="tag">People Analytics</span>
          <span className="tag">Workforce Management</span>
          <span className="tag">Data Strategy</span>
          <span className="tag">Product Ownership</span>
          <span className="tag">Warwick</span>
        </div>
      </div>

      {/* Bio */}
      <div style={{ maxWidth: 680, marginBottom: '3rem' }}>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
          I'm a millennial from Santiago, Chile — currently based in London. By day I lead People Insights at
          Ocado Logistics, sitting at the intersection of People Analytics and Workforce Management: using data to
          understand and improve how a 20,000-person operation actually runs — from onboarding to absence to headcount planning.
          By night I'm usually out running, watching <strong style={{ color: 'var(--text)' }}>Universidad Católica</strong> (always), or tinkering with a side project.
        </p>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
          I speak Spanish natively, English fluently, and enough German to get myself into trouble. I studied
          Industrial Engineering at Universidad Adolfo Ibañez, then doubled down with an MSc in Business Analytics
          at Warwick Business School — where my dissertation tackled adaptive AI scheduling for workforce planning,
          because apparently the overlap between operations research and HR data is where I'm most comfortable.
        </p>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
          Outside of work my world revolves around sport — football, running, and anything outdoors. I genuinely
          believe in contributing to society as an individual: listening well, helping where I can, and building
          things that are useful to real people. That's why I ended up in People Analytics — it sits right at the
          intersection of data and human impact.
        </p>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
          I also love to travel — my partner is the one who actually plans everything, navigates airports like a
          professional, and somehow knows the best restaurant in every city we visit. I just show up and try to
          look like I knew all along. Honestly, I'm very lucky she keeps me around.
        </p>

        {/* Socials */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target={s.label !== 'Email' ? '_blank' : undefined}
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 500,
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.15s ease',
                boxShadow: 'var(--shadow)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Section nav cards */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Explore
        </p>
      </div>
      <div className="nav-cards">
        {NAV_CARDS.map(card => (
          <div
            key={card.id}
            className="nav-card"
            onClick={() => onNavigate(card.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onNavigate(card.id)}
          >
            <span className="nav-card-icon">{card.icon}</span>
            <h3 className="nav-card-title">{card.title}</h3>
            <p className="nav-card-desc">{card.desc}</p>
            <span className="nav-card-arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  )
}
