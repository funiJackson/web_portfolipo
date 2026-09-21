import type { Project } from '../data/projects'
import { useInView } from '../hooks/useInView'
import { Mosaic } from './Mosaic'

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <article
      ref={ref}
      id={`project-${project.id}`}
      className={`project-card reveal ${inView ? 'is-in' : ''}`}
      data-accent={project.accent}
      style={{ '--i': index } as React.CSSProperties}
    >
      <Mosaic icon={project.icon} />
      <div className="card-body">
        <p className="card-date">{project.date}</p>
        <h4>{project.name}</h4>
        <div className="tech-list">
          {project.tags.map(tag => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p className="card-desc">{project.blurb}</p>
        <div className="project-links">
          {project.live && (
            <a target="_blank" rel="noreferrer" href={project.live}>
              Live
            </a>
          )}
          {project.repo && (
            <a target="_blank" rel="noreferrer" href={project.repo}>
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
