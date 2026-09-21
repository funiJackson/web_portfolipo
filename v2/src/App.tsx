import { useCallback, useEffect, useState } from 'react'
import { CommandPalette } from './components/CommandPalette'
import { Diorama } from './components/Diorama'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { StatusBar } from './components/StatusBar'
import { Terminal } from './components/Terminal'
import { PROFILE } from './data/projects'
import { useActiveSection } from './hooks/useActiveSection'

const WORKSPACES = [
  { id: 'home', label: 'home' },
  { id: 'skills', label: 'skills' },
  { id: 'projects', label: 'projects' },
  { id: 'shell', label: 'shell' },
]

const SECTION_IDS = WORKSPACES.map(ws => ws.id)

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  const focusShell = useCallback(() => {
    const input = document.getElementById('term-input')
    document.getElementById('shell')?.scrollIntoView({ behavior: 'smooth' })
    // let the scroll start before stealing focus, or Safari jumps
    setTimeout(() => input?.focus(), 250)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey

      if (isMod && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen(open => !open)
        return
      }

      // everything below is a bare key, so never while typing
      if (isTyping(event.target) || isMod || event.altKey) return

      if (event.key === 'Escape') {
        setPaletteOpen(false)
        return
      }

      if (event.key >= '1' && event.key <= String(WORKSPACES.length)) {
        const section = WORKSPACES[Number(event.key) - 1]
        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })
        return
      }

      if (event.key === '/') {
        event.preventDefault()
        focusShell()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [focusShell])

  return (
    <>
      <Diorama />

      <StatusBar
        workspaces={WORKSPACES}
        active={active}
        onOpenPalette={() => setPaletteOpen(true)}
        github={PROFILE.github}
        linkedin={PROFILE.linkedin}
      />

      <main>
        <Hero />
        <Skills />
        <Projects />
        <Terminal />
      </main>

      <footer className="page-footer">
        <p>
          By{' '}
          <a target="_blank" rel="noreferrer" href={PROFILE.github}>
            Jackson
          </a>{' '}
          — the repo on{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/funiJackson/web_portfolipo"
          >
            GitHub
          </a>
        </p>
        <p>React + TypeScript · built in a terminal, more or less</p>
      </footer>

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onFocusShell={focusShell}
        />
      )}
    </>
  )
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  )
}
