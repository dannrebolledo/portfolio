import React, { useState, useRef, useEffect } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const SYSTEM_PROMPT = `You are Daniel Rebolledo's intelligent assistant, responding on his personal portfolio website.

Daniel works at the intersection of People Analytics and Workforce Management — using data to make organisations run better and treat people more fairly.

Background:
- Current role: People Insights Lead at Ocado Logistics (Sep 2025–present), London — team of 3 analysts, 20k employee organisation; owns the product strategy shifting HR from reactive reporting to self-serve workforce intelligence
- Workforce Management focus: absence analytics, headcount planning, turnover reduction, onboarding analysis, operational workforce data — not just strategic dashboards but decisions that affect day-to-day operations
- Previous: Product Owner (People Analytics) at Falabella S.A., Chile (Jul 2023 – Sep 2024) — "data as a product" operating model, 450% user growth across 10+ data products
- Before that: Data Analyst (People Analytics) at Falabella S.A., Chile (Jun 2022 – Jun 2023) — compensation and org structure products covering 60–90k employees
- Education: MSc Business Analytics (1st, Graduated), Warwick Business School (Oct 2024 – Sep 2025) — Dissertation with Distinction: "Adaptive AI Workforce Scheduling under Uncertainty" — applying ML to real-world scheduling problems; Warwick Departmental Scholarship
- Earlier education: BSc Industrial Engineering (1st), Universidad Adolfo Ibañez, Chile — University of Zurich exchange; operations research and statistics background that underpins the WFM thinking
- Skills: GCP, Tableau, Power BI, Python, R, SQL, Airflow, dbt, Jira; workforce scheduling, absence modelling, headcount forecasting, attrition prediction, data product management
- Languages: English (fluent), Spanish (native), German (proficient)
- Key achievements: 50% early turnover reduction at Ocado (£500k savings, 6 months); 20% controllable absence reduction; 60% ad-hoc demand reduction; 450% user growth at Falabella

Respond in first person as Daniel. Be warm, sharp, and concise. When relevant, connect People Analytics and Workforce Management — Daniel sees them as two sides of the same coin: one tells you what's happening with your people, the other helps you act on it operationally.`

const DEFAULT_POSTS = [
  {
    id: 1,
    date: 'March 2025',
    title: 'Building a People Analytics Function from Scratch',
    excerpt: 'When I joined Falabella in 2019, People Analytics didn\'t exist — there were spreadsheets, gut feeling, and a lot of siloed HRIS data. Here\'s what I learned building the function from zero to a team of four analysts across six countries.',
    readTime: '6 min read',
    tags: ['Strategy', 'Leadership'],
  },
  {
    id: 2,
    date: 'January 2025',
    title: 'Why HR Data is the Most Underutilised Strategic Asset',
    excerpt: 'Every major business decision involves people, yet most organisations still treat workforce data as a compliance obligation. The shift from "reporting headcount" to "informing strategy" requires more than dashboards — it requires a fundamentally different operating model.',
    readTime: '5 min read',
    tags: ['Opinion', 'Data Strategy'],
  },
]

async function askGroq(messages) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 512,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${res.status}`)
  }
  const data = await res.json()
  return data.choices[0].message.content
}

function Chat({ isAdmin }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m Daniel\'s AI assistant. Ask me anything about his background, projects, or thoughts on People Analytics.' },
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const userMsg   = { role: 'user', text }
    const history   = messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0)
    const apiHistory = history.map(m => ({ role: m.role, content: m.text }))
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const reply = await askGroq([...apiHistory, { role: 'user', content: text }])
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: `⚠ ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`message message-${m.role === 'user' ? 'user' : 'ai'}`}>
            <div className="message-avatar">
              {m.role === 'user' ? 'DR' : 'AI'}
            </div>
            <div className="message-bubble">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="message message-ai">
            <div className="message-avatar">AI</div>
            <div className="message-bubble">
              <div className="chat-typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
      </div>
      <form
        className="chat-form"
        onSubmit={e => { e.preventDefault(); send() }}
      >
        <input
          className="input"
          type="text"
          placeholder="Ask me anything about People Analytics…"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button className="btn btn-primary" type="submit" disabled={loading || !input.trim()}>
          Send →
        </button>
        {isAdmin && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onSetApiKey('')} title="Remove API key">
            ✕
          </button>
        )}
      </form>
    </>
  )
}

export default function AboutBlog({ isAdmin }) {
  const [posts, setPosts]       = useLocalStorage('portfolio_blog_posts', DEFAULT_POSTS)
  const [editingId, setEditing] = useState(null)
  const [editText, setEditText] = useState('')

  const startEdit = (post) => {
    setEditing(post.id)
    setEditText(post.excerpt)
  }
  const saveEdit = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, excerpt: editText } : p))
    setEditing(null)
  }

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">About & Blog</h1>
        <p className="section-subtitle">The longer version of who I am, a couple of things I've written, and an AI that knows me better than some of my colleagues do.</p>
      </div>

      <div className="about-grid">
        <div className="about-bio">
          <h2>About me</h2>
          <p>
            I work at the intersection of People Analytics and Workforce Management — two disciplines that are often treated separately but belong together.
            People Analytics tells you what's happening with your workforce; Workforce Management helps you act on it operationally. I've spent the last few years building the data products that connect both.
          </p>
          <p>
            At Ocado Logistics I lead a team of 3 analysts owning the full People Insights product suite for a 20,000-person operation — from absence modelling and onboarding analytics to headcount forecasting and self-serve platforms that actually get used.
            Before that, I built People Analytics capabilities from the ground up at Falabella across Latin America.
          </p>
          <p>
            I recently graduated with an MSc in Business Analytics from Warwick Business School, where my dissertation explored adaptive AI scheduling for workforce management under uncertainty — because the
            overlap between operations research and HR data is where the interesting problems live.
          </p>
          <p>
            Outside of work I'm usually running — training for marathons and tracking everything obsessively, which is probably why the Running section of this portfolio exists.
          </p>
          <div className="about-skills">
            {['People Analytics', 'Workforce Management', 'Absence Modelling', 'Headcount Forecasting', 'AI Scheduling', 'Python', 'SQL', 'GCP', 'Power BI', 'Tableau', 'Airflow', 'dbt', 'Product Management'].map(s => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>
        </div>

        <div className="blog-section">
          <h2>Writing</h2>
          <div className="blog-posts">
            {posts.map(post => (
              <div key={post.id} className="blog-post">
                <div className="blog-post-meta">{post.date} · {post.readTime}</div>
                <h3 className="blog-post-title">{post.title}</h3>

                {editingId === post.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <textarea
                      className="input"
                      rows={4}
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => saveEdit(post.id)}>Save</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="blog-post-excerpt">{post.excerpt}</p>
                )}

                <div className="blog-post-footer">
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isAdmin && editingId !== post.id && (
                      <button className="btn btn-ghost btn-sm" onClick={() => startEdit(post)}>Edit</button>
                    )}
                    <button className="btn btn-outline btn-sm">Read →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chat-section">
        <div className="chat-header">
          <div>
            <h3>Chat with Daniel's AI</h3>
            <p>Powered by Llama 3.3 — ask about People Analytics, career, projects</p>
          </div>
          <div className="chat-ai-indicator">
            <span className="ai-dot" />
            Llama 3.3 · Groq
          </div>
        </div>
        <Chat isAdmin={isAdmin} />
      </div>
    </div>
  )
}
