import React from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const DEFAULT_PROJECTS = [
  {
    id: 'strava-dashboard',
    name: 'Strava Dashboard',
    description: 'Personal running analytics dashboard connecting to the Strava API with trend analysis, elevation profiling, and performance predictions.',
    status: 'in-progress',
    progress: 75,
    milestones: [
      { id: 1, text: 'OAuth integration with Strava API', done: true },
      { id: 2, text: 'Activity data pipeline & storage', done: true },
      { id: 3, text: 'Core visualizations — pace, elevation, HR', done: true },
      { id: 4, text: 'Performance prediction model (V02 max estimate)', done: false },
      { id: 5, text: 'Public deployment on Streamlit Cloud', done: false },
    ],
    tags: ['Python', 'Streamlit', 'Strava API', 'Pandas'],
    github: 'https://github.com/dannrebolledo',
  },
  {
    id: 'pa-toolkit',
    name: 'People Analytics Toolkit',
    description: 'Open-source Python library for HR data analysis — attrition modeling, engagement scoring, workforce planning, and pay equity analysis.',
    status: 'planning',
    progress: 45,
    milestones: [
      { id: 1, text: 'Package architecture & API design', done: true },
      { id: 2, text: 'Attrition prediction module (logistic + survival)', done: true },
      { id: 3, text: 'Engagement scoring algorithms', done: false },
      { id: 4, text: 'Pay equity analysis module', done: false },
      { id: 5, text: 'Documentation & PyPI publishing', done: false },
    ],
    tags: ['Python', 'scikit-learn', 'Pandas', 'Lifelines'],
    github: 'https://github.com/dannrebolledo',
  },
  {
    id: 'this-portfolio',
    name: 'This Portfolio',
    description: 'Personal portfolio built with Vite + React, featuring an interactive career timeline, GitHub integration, running visualizations, and an AI-powered chat.',
    status: 'in-progress',
    progress: 90,
    milestones: [
      { id: 1, text: 'Design system — earthy palette + editorial typography', done: true },
      { id: 2, text: 'All six sections implemented', done: true },
      { id: 3, text: 'Live GitHub API integration', done: true },
      { id: 4, text: 'Claude AI chat with persona', done: true },
      { id: 5, text: 'Deploy to production (Vercel / Cloudflare)', done: false },
    ],
    tags: ['React', 'Vite', 'Recharts', 'Claude API'],
    github: 'https://github.com/dannrebolledo/portfolio',
  },
]

const STATUS_BADGES = {
  'in-progress': { label: 'In Progress', cls: 'badge-amber' },
  'planning':    { label: 'Planning',    cls: 'badge-blue'  },
  'done':        { label: 'Done',        cls: 'badge-green' },
}

export default function Projects({ isAdmin }) {
  const [projects, setProjects] = useLocalStorage('portfolio_projects', DEFAULT_PROJECTS)

  const toggleMilestone = (projId, msId) => {
    setProjects(projects.map(p =>
      p.id !== projId ? p : {
        ...p,
        milestones: p.milestones.map(m => m.id === msId ? { ...m, done: !m.done } : m),
      }
    ))
  }

  const updateProgress = (projId, val) => {
    setProjects(projects.map(p => p.id !== projId ? p : { ...p, progress: Number(val) }))
  }

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Projects</h1>
        <p className="section-subtitle">
          Things I build when I should probably be sleeping. Work in progress — much like myself.
          {isAdmin && <span className="badge badge-admin" style={{ marginLeft: '0.75rem' }}>Editing</span>}
        </p>
      </div>

      <div className="projects-grid">
        {projects.map(project => {
          const badge = STATUS_BADGES[project.status]
          const doneCount = project.milestones.filter(m => m.done).length
          return (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h2 className="project-title">{project.name}</h2>
                <span className={`badge ${badge.cls}`}>{badge.label}</span>
              </div>

              <p className="project-desc">{project.description}</p>

              <div className="project-progress-label">
                <span>{doneCount}/{project.milestones.length} milestones</span>
                <strong>{project.progress}%</strong>
              </div>
              <div className="progress-wrap">
                <div className="progress-fill" style={{ width: `${project.progress}%` }} />
              </div>

              {isAdmin && (
                <div style={{ marginTop: '0.75rem' }}>
                  <input
                    className="progress-slider"
                    type="range"
                    min="0" max="100"
                    value={project.progress}
                    onChange={e => updateProgress(project.id, e.target.value)}
                  />
                </div>
              )}

              <div className="project-milestones">
                <div className="milestones-title">Milestones</div>
                <div className="milestone-list">
                  {project.milestones.map(ms => (
                    <div key={ms.id} className={`milestone-item${ms.done ? ' done' : ''}`}>
                      <input
                        type="checkbox"
                        id={`ms-${project.id}-${ms.id}`}
                        checked={ms.done}
                        onChange={() => isAdmin && toggleMilestone(project.id, ms.id)}
                        disabled={!isAdmin}
                      />
                      <label htmlFor={`ms-${project.id}-${ms.id}`}>{ms.text}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="project-footer">
                <div className="project-tags">
                  {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                    ⭳ GitHub
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
