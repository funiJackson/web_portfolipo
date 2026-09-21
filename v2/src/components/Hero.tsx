import { useEffect, useState } from 'react'
import { PROFILE } from '../data/projects'
import { MOD_KEY } from '../lib/platform'
import { Window } from './Window'

export function Hero() {
  const typed = useTypewriter(PROFILE.role)

  return (
    <Window id="home" title="~/whoami" tag="zsh">
      <p className="prompt">whoami</p>
      <div>
        <h1>{PROFILE.name}</h1>
        <p className="hero-role">
          {typed}
          <span className="caret" />
        </p>
      </div>
      <p className="bio">{PROFILE.bio}</p>
      <div className="links-container">
        <a href={`mailto:${PROFILE.email}`}>email</a>
        <a target="_blank" rel="noreferrer" href={PROFILE.linkedin}>
          linkedin
        </a>
        <a target="_blank" rel="noreferrer" href={PROFILE.github}>
          github
        </a>
      </div>
      <p className="hints">
        <span>
          <kbd className="sym">{MOD_KEY}</kbd>
          <kbd>K</kbd> commands
        </span>
        <span>
          <kbd>1</kbd>
          <kbd>2</kbd>
          <kbd>3</kbd>
          <kbd>4</kbd> jump
        </span>
        <span>
          <kbd className="sym">/</kbd> shell
        </span>
      </p>
    </Window>
  )
}

/** Types the role out once, one character every 55ms. */
function useTypewriter(text: string) {
  // with reduced motion the role is simply there from the first paint
  const [count, setCount] = useState(() => (prefersReducedMotion() ? text.length : 0))

  useEffect(() => {
    if (prefersReducedMotion()) return

    const id = setInterval(() => {
      setCount(current => {
        if (current >= text.length) {
          clearInterval(id)
          return current
        }
        return current + 1
      })
    }, 55)

    return () => clearInterval(id)
  }, [text])

  return text.slice(0, count)
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
