import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface WindowProps {
  id?: string
  title: string
  tag?: string
  children: ReactNode
}

/** A section dressed as a tiled window: title bar, traffic lights, lit border. */
export function Window({ id, title, tag, children }: WindowProps) {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section
      id={id}
      ref={ref}
      className={`win reveal ${inView ? 'is-in' : ''}`}
    >
      <div className="win-bar">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="win-title">{title}</span>
        {tag && <span className="win-tag">{tag}</span>}
      </div>
      <div className="win-body">{children}</div>
    </section>
  )
}
