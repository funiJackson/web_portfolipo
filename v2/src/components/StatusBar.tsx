import { useEffect, useState } from 'react'
import { MOD_KEY } from '../lib/platform'

interface Workspace {
  id: string
  label: string
}

interface StatusBarProps {
  workspaces: Workspace[]
  active: string
  onOpenPalette: () => void
  github: string
  linkedin: string
}

export function StatusBar({
  workspaces,
  active,
  onOpenPalette,
  github,
  linkedin,
}: StatusBarProps) {
  const [time, setTime] = useState(() => clockText())

  useEffect(() => {
    const id = setInterval(() => setTime(clockText()), 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="bar">
      <div className="bar-group">
        {workspaces.map((ws, i) => (
          <a
            key={ws.id}
            className={`ws ${active === ws.id ? 'is-active' : ''}`}
            href={`#${ws.id}`}
          >
            {i + 1} <span>{ws.label}</span>
          </a>
        ))}
      </div>

      <div className="bar-group bar-title">
        <b>jackson</b>@portfolio:~
      </div>

      <div className="bar-group">
        <button className="bar-btn" onClick={onOpenPalette} title="command palette">
          <span className="glyph">{MOD_KEY}</span>K
        </button>
        <span className="clock">{time}</span>
        <span className="bar-icons">
          <a target="_blank" rel="noreferrer" href={github} aria-label="GitHub">
            <i className="fa-brands fa-github" />
          </a>
          <a target="_blank" rel="noreferrer" href={linkedin} aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin" />
          </a>
        </span>
      </div>
    </header>
  )
}

function clockText() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
