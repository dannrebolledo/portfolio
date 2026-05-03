import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Home from './components/sections/Home'
import CVJourney from './components/sections/CVJourney'
import Projects from './components/sections/Projects'
import GitHub from './components/sections/GitHub'
import Running from './components/sections/Running'
import AboutBlog from './components/sections/AboutBlog'

const SECTIONS = [
  { id: 'home',     label: 'Home',         icon: '◆' },
  { id: 'cv',       label: 'CV & Journey', icon: '◈' },
  { id: 'projects', label: 'Projects',     icon: '◉' },
  { id: 'github',   label: 'GitHub',       icon: '◎' },
  { id: 'running',  label: 'Running',      icon: '◇' },
  { id: 'about',    label: 'About & Blog', icon: '○' },
]

export default function App() {
  const [section, setSection]       = useState('home')
  const [isAdmin, setIsAdmin]       = useState(false)
  const [sidebarOpen, setSidebar]   = useState(false)

  const navigate = (id) => { setSection(id); setSidebar(false) }

  const views = {
    home:     <Home onNavigate={navigate} />,
    cv:       <CVJourney />,
    projects: <Projects isAdmin={isAdmin} />,
    github:   <GitHub />,
    running:  <Running />,
    about:    <AboutBlog isAdmin={isAdmin} />,
  }

  return (
    <div className="app-layout">
      <button
        className="hamburger"
        onClick={() => setSidebar(v => !v)}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>

      <Sidebar
        sections={SECTIONS}
        current={section}
        onNavigate={navigate}
        isAdmin={isAdmin}
        onAdminChange={setIsAdmin}
        isOpen={sidebarOpen}
      />

      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebar(false)} />
      )}

      <main className="main-content">
        {views[section]}
      </main>
    </div>
  )
}
