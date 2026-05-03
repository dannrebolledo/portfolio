import React, { useState } from 'react'

const TIMELINE = [
  {
    id: 'ocado',
    period: 'Sep 2025 — Present',
    company: 'Ocado Logistics',
    role: 'People Insights Lead',
    location: 'London, UK',
    type: 'work',
    link: 'https://www.ocadogroup.com/',
    logo: 'https://logo.clearbit.com/ocado.com',
    bullets: [
      'Defined and drove the People Insights product strategy and roadmap for a 20k employee organisation, leading a team of 3 analysts to shift the function from reactive reporting to a trusted, self-serve analytics platform used by Senior Managers and above',
      'Identified onboarding as a high-impact product opportunity through employee journey analysis; championed the initiative with People Leadership and delivered a 50% reduction in early turnover, generating £500k in savings within 6 months',
      'Took complete ownership of the absence analytics product from discovery to launch — defined use cases with HR business partners, led engineering and design through build, and tracked adoption and outcomes; delivered a 20% reduction in controllable absence',
      'Consolidated three strategic workforce pillars — Headcount, Turnover, and Absence — into a unified product suite, reducing ad-hoc demand by 60% and enabling senior stakeholders to make data-driven decisions autonomously',
    ],
    tags: ['Product Strategy', 'People Analytics', 'GCP', 'Self-serve Analytics', 'Stakeholder Management'],
  },
  {
    id: 'warwick',
    period: 'Oct 2024 — Sep 2025',
    company: 'Warwick Business School',
    role: 'MSc Business Analytics (1st) — Graduated',
    location: 'Coventry, UK',
    type: 'edu',
    completed: true,
    link: 'https://www.wbs.ac.uk/',
    logo: 'https://logo.clearbit.com/warwick.ac.uk',
    bullets: [
      'Dissertation (Distinction): "Adaptive AI Workforce Scheduling under Uncertainty"',
      'Awarded University of Warwick Departmental Scholarship',
      'Contributor at Events, Warwick Data Science Society (Oct 2024 – Jul 2025)',
    ],
    tags: ['Business Analytics', 'AI/ML', 'Workforce Scheduling', 'Research'],
  },
  {
    id: 'falabella-po',
    period: 'Jul 2023 — Sep 2024',
    company: 'Falabella S.A.',
    role: 'Product Owner — People Analytics',
    location: 'Santiago, Chile',
    type: 'work',
    link: 'https://www.falabella.com/',
    logo: 'https://logo.clearbit.com/falabella.com',
    bullets: [
      'Owned the end-to-end product strategy for the People Analytics platform — defined product vision, user personas, and a prioritised roadmap across ingestion, transformation, and serving layers',
      'Pioneered a "data as a product" operating model for the People function — introduced user research, adoption metrics, and data privacy standards across 10+ products; grew the active user base by 450%',
      'Led cross-functional squads of engineers, analysts, and HR business partners through full product lifecycle — presenting strategic plans to a steering committee of 15+ functional leaders',
      'Established product quality standards across 10+ data products — implementing monitoring, documentation, and SLA frameworks that shifted the team from reactive fixes to proactive product stewardship',
    ],
    tags: ['Product Management', 'Data Products', 'Roadmap', 'Stakeholder Management', 'SQL'],
  },
  {
    id: 'falabella-da',
    period: 'Jun 2022 — Jun 2023',
    company: 'Falabella S.A.',
    role: 'Data Analyst — People Analytics',
    location: 'Santiago, Chile',
    type: 'work',
    link: 'https://www.falabella.com/',
    logo: 'https://logo.clearbit.com/falabella.com',
    bullets: [
      'Conceived and delivered a global compensation data product covering 60k+ employees across 3 businesses and 5 countries — drove adoption to 70% of the organisation',
      'Built an organisational structure data product serving 90k+ employees (100% of the organisation), enabling managers to standardise workforce planning and span of control',
      'Enhanced last mile costs dashboard for 1MM orders/month, supplying insights that optimised logistics operations across first-party and third-party transport providers',
      'Built and scaled a data governance framework across 15+ data products, establishing a cross-functional community of 20+ technical and functional leaders',
    ],
    tags: ['Data Analytics', 'Power BI', 'Python', 'SQL', 'Data Governance'],
  },
  {
    id: 'uai',
    period: 'Mar 2014 — Dec 2019',
    company: 'Universidad Adolfo Ibañez',
    role: 'BSc Industrial Engineering (1st) — Graduated',
    location: 'Santiago, Chile',
    type: 'edu',
    completed: true,
    link: 'https://www.uai.cl/',
    logo: 'https://logo.clearbit.com/uai.cl',
    bullets: [
      'Awarded the International Leader Student Scholarship for University of Zurich Exchange Program',
      'Specialisation in Operations Research, Statistics, and Organisational Management',
    ],
    tags: ['Industrial Engineering', 'Operations Research', 'Statistics'],
  },
]

export default function CVJourney() {
  const [expanded, setExpanded] = useState('ocado')

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">CV & Journey</h1>
        <p className="section-subtitle">Santiago → Coventry → London. A journey through People Analytics, Workforce Management, and the belief that data about people should actually help them — click any role to see what happened.</p>
      </div>

      <div className="timeline">
        {TIMELINE.map(item => (
          <div
            key={item.id}
            className={`timeline-item timeline-type-${item.type}${expanded === item.id ? ' expanded' : ''}`}
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
          >
            <div className="timeline-dot" />
            <div className="timeline-card">
              <div className="timeline-header">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="timeline-date">{item.period}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="timeline-company"
                      onClick={e => e.stopPropagation()}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
                    >
                      {item.company} ↗
                    </a>
                    {item.completed && (
                      <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>✓ Graduated</span>
                    )}
                  </div>
                  <div className="timeline-role">{item.role.replace(' — Graduated', '')}</div>
                  <div className="timeline-location">📍 {item.location}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem', flexShrink: 0 }}>
                  <div style={{
                    width: 48, height: 48,
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                    padding: 4,
                    boxShadow: 'var(--shadow)',
                  }}>
                    <img
                      src={item.logo}
                      alt={item.company}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={e => {
                        e.target.style.display = 'none'
                        e.target.parentNode.innerHTML = `<span style="font-size:1.1rem;font-weight:700;color:var(--accent);font-family:var(--font-display)">${item.company.charAt(0)}</span>`
                      }}
                    />
                  </div>
                  <span className={`badge ${item.type === 'edu' ? 'badge-blue' : 'badge-amber'}`}>
                    {item.type === 'edu' ? '🎓 Education' : '💼 Work'}
                  </span>
                </div>
              </div>

              {expanded !== item.id && (
                <div className="timeline-expand-hint">
                  <span>Click to expand</span>
                  <span>↓</span>
                </div>
              )}

              {expanded === item.id && (
                <div className="timeline-body">
                  <ul className="timeline-bullets">
                    {item.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <div className="timeline-tags">
                    {item.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
