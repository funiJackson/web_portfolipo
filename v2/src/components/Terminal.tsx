import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { PROFILE, PROJECTS, SKILLS } from '../data/projects'
import { Window } from './Window'

type LineKind = 'cmd' | 'out' | 'err' | 'note'

interface Line {
  id: number
  kind: LineKind
  text: string
}

const COMMANDS = [
  'help',
  'ls',
  'cat',
  'open',
  'whoami',
  'skills',
  'contact',
  'neofetch',
  'date',
  'clear',
] as const

const BANNER = [
  "type 'help' for the command list, 'ls' for the projects.",
  "tab completes, ↑/↓ walks the history.",
]

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(() =>
    BANNER.map((text, id) => ({ id, kind: 'note' as LineKind, text }))
  )
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)

  const nextId = useRef(BANNER.length)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [lines])

  const print = (entries: [LineKind, string][]) => {
    setLines(current => [
      ...current,
      ...entries.map(([kind, text]) => ({ id: nextId.current++, kind, text })),
    ])
  }

  const run = (raw: string) => {
    const input = raw.trim()
    if (!input) return

    setHistory(current => [input, ...current])
    setCursor(-1)
    print([['cmd', input]])

    const [name, ...args] = input.split(/\s+/)
    const arg = args.join(' ').toLowerCase()

    switch (name.toLowerCase()) {
      case 'help':
        print([
          ['out', 'available commands:'],
          ['out', '  help              this list'],
          ['out', '  ls                list the projects'],
          ['out', '  cat <project>     print one project'],
          ['out', '  open <project>    open its live link in a new tab'],
          ['out', '  whoami            the short version'],
          ['out', '  skills            the stack'],
          ['out', '  contact           email / github / linkedin'],
          ['out', '  neofetch          the obligatory one'],
          ['out', '  date, clear'],
        ])
        break

      case 'ls':
        print(
          PROJECTS.map(p => [
            'out',
            `  ${p.id.padEnd(10)} ${p.date.padEnd(14)} ${p.name}`,
          ])
        )
        break

      case 'cat': {
        const project = findProject(arg)
        if (!project) {
          print([['err', `cat: ${arg || '?'}: no such project — try 'ls'`]])
          break
        }
        print([
          ['out', `${project.name}  (${project.date})`],
          ['out', `  ${project.tags.join(' · ')}`],
          ['out', `  ${project.blurb}`],
          ...(project.live
            ? ([['out', `  live: ${project.live}`]] as [LineKind, string][])
            : []),
          ...(project.repo
            ? ([['out', `  repo: ${project.repo}`]] as [LineKind, string][])
            : []),
        ])
        break
      }

      case 'open': {
        const project = findProject(arg)
        const url = project?.live ?? project?.repo
        if (!project || !url) {
          print([['err', `open: ${arg || '?'}: no such project — try 'ls'`]])
          break
        }
        window.open(url, '_blank', 'noopener')
        print([['note', `opening ${project.name} → ${url}`]])
        break
      }

      case 'whoami':
        print([
          ['out', PROFILE.name],
          ['out', `  ${PROFILE.role} · MSc Computer Science, Newcastle University`],
        ])
        break

      case 'skills':
        print(
          SKILLS.flatMap(group => [
            ['out', `  ${group.area}`],
            ['out', `    ${group.items.join(' · ')}`],
          ]) as [LineKind, string][]
        )
        break

      case 'contact':
      case 'email':
        print([
          ['out', `  email     ${PROFILE.email}`],
          ['out', `  github    ${PROFILE.github}`],
          ['out', `  linkedin  ${PROFILE.linkedin}`],
        ])
        break

      case 'neofetch':
        print([
          ['out', `  ${PROFILE.name.toLowerCase().replace(/\s+/g, '')}@portfolio`],
          ['out', '  ─────────────────────────'],
          ['out', '  OS       the web'],
          ['out', '  WM       React 19 + TypeScript'],
          ['out', '  Theme    hd-2d night diorama'],
          ['out', `  Projects ${PROJECTS.length}`],
          ['out', '  Uptime   MSc in progress'],
        ])
        break

      case 'date':
        print([['out', new Date().toString()]])
        break

      case 'clear':
        setLines([])
        break

      case 'sudo':
        print([['err', 'jackson is not in the sudoers file. This incident will be reported.']])
        break

      case 'exit':
        print([['note', "there's no way out, this is a portfolio"]])
        break

      default:
        print([
          ['err', `zsh: command not found: ${name}`],
          ['note', "try 'help'"],
        ])
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      run(value)
      setValue('')
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!history.length) return
      const next = Math.min(cursor + 1, history.length - 1)
      setCursor(next)
      setValue(history[next])
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const next = cursor - 1
      setCursor(next)
      setValue(next < 0 ? '' : history[next])
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      setValue(complete(value))
      return
    }

    if (event.key === 'Escape') {
      event.currentTarget.blur()
    }
  }

  return (
    <Window id="shell" title="~/shell" tag="zsh">
      <div className="term" onClick={() => inputRef.current?.focus()}>
        <div className="term-log" ref={logRef}>
          {lines.map(line => (
            <div key={line.id} className={`term-line ${line.kind}`}>
              {line.text}
            </div>
          ))}
        </div>
        <label className="term-input">
          <span>❯</span>
          <input
            id="term-input"
            ref={inputRef}
            value={value}
            spellCheck={false}
            autoComplete="off"
            aria-label="terminal input"
            placeholder="help"
            onChange={event => setValue(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </label>
      </div>
    </Window>
  )
}

function findProject(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return undefined
  return PROJECTS.find(
    p => p.id === q || p.name.toLowerCase() === q || p.name.toLowerCase().includes(q)
  )
}

/** Completes the command name, or the argument of cat/open. */
function complete(input: string): string {
  const parts = input.split(/\s+/)

  if (parts.length <= 1) {
    const match = COMMANDS.find(c => c.startsWith(parts[0] ?? ''))
    return match ? match + ' ' : input
  }

  const [name, ...rest] = parts
  const fragment = rest.join(' ').toLowerCase()
  const pool = name === 'cat' || name === 'open' ? PROJECTS.map(p => p.id) : []

  const match = pool.find(item => item.startsWith(fragment))
  return match ? `${name} ${match}` : input
}
