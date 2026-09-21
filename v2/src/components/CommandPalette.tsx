import { useEffect, useMemo, useRef, useState } from 'react'
import { PROFILE, PROJECTS } from '../data/projects'

export interface Action {
  id: string
  label: string
  kind: string
  glyph: string
  run: () => void
}

interface PaletteProps {
  onClose: () => void
  onFocusShell: () => void
}

export function CommandPalette({ onClose, onFocusShell }: PaletteProps) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const actions = useMemo<Action[]>(
    () => buildActions({ onClose, onFocusShell }),
    [onClose, onFocusShell]
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return actions
    return actions.filter(action =>
      `${action.label} ${action.kind}`.toLowerCase().includes(q)
    )
  }, [actions, query])

  useEffect(() => inputRef.current?.focus(), [])

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [index])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIndex(i => (i + 1) % Math.max(results.length, 1))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setIndex(i => (i - 1 + results.length) % Math.max(results.length, 1))
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      results[index]?.run()
    }
  }

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="command palette"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="palette" onKeyDown={onKeyDown}>
        <div className="palette-input">
          <span>❯</span>
          <input
            ref={inputRef}
            value={query}
            spellCheck={false}
            placeholder="jump to a section, open a project, copy an email…"
            aria-label="search commands"
            onChange={event => {
              setQuery(event.target.value)
              setIndex(0)
            }}
          />
          <kbd>esc</kbd>
        </div>

        <div className="palette-list" ref={listRef}>
          {results.length === 0 && (
            <p className="palette-empty">no match — try 'riff' or 'shell'</p>
          )}
          {results.map((action, i) => (
            <button
              key={action.id}
              className="palette-item"
              aria-selected={i === index}
              onMouseEnter={() => setIndex(i)}
              onClick={action.run}
            >
              <span className="glyph">{action.glyph}</span>
              {action.label}
              <span className="kind">{action.kind}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function buildActions({ onClose, onFocusShell }: PaletteProps): Action[] {
  const go = (id: string) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    onClose()
  }

  const sections: Action[] = [
    { id: 'go-home', label: 'Go to home', kind: 'section', glyph: '~', run: go('home') },
    { id: 'go-skills', label: 'Go to skills', kind: 'section', glyph: '~', run: go('skills') },
    {
      id: 'go-projects',
      label: 'Go to projects',
      kind: 'section',
      glyph: '~',
      run: go('projects'),
    },
    {
      id: 'go-shell',
      label: 'Open the shell',
      kind: 'section',
      glyph: '❯',
      run: () => {
        onFocusShell()
        onClose()
      },
    },
  ]

  const projects: Action[] = PROJECTS.flatMap(project => {
    const url = project.live ?? project.repo
    const entries: Action[] = [
      {
        id: `card-${project.id}`,
        label: `Jump to ${project.name}`,
        kind: 'project',
        glyph: '▚',
        run: () => {
          document
            .getElementById(`project-${project.id}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          onClose()
        },
      },
    ]

    if (url) {
      entries.push({
        id: `open-${project.id}`,
        label: `Open ${project.name}`,
        kind: 'link',
        glyph: '↗',
        run: () => {
          window.open(url, '_blank', 'noopener')
          onClose()
        },
      })
    }

    return entries
  })

  const contact: Action[] = [
    {
      id: 'copy-email',
      label: `Copy email — ${PROFILE.email}`,
      kind: 'contact',
      glyph: '@',
      run: () => {
        navigator.clipboard?.writeText(PROFILE.email)
        onClose()
      },
    },
    {
      id: 'open-github',
      label: 'Open GitHub profile',
      kind: 'link',
      glyph: '↗',
      run: () => {
        window.open(PROFILE.github, '_blank', 'noopener')
        onClose()
      },
    },
    {
      id: 'open-linkedin',
      label: 'Open LinkedIn profile',
      kind: 'link',
      glyph: '↗',
      run: () => {
        window.open(PROFILE.linkedin, '_blank', 'noopener')
        onClose()
      },
    },
  ]

  return [...sections, ...projects, ...contact]
}
