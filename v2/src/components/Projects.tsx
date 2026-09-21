import { PROJECTS } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { Window } from './Window'

export function Projects() {
  return (
    <Window id="projects" title="~/projects" tag={String(PROJECTS.length)}>
      <p className="prompt">ls ~/projects</p>
      <h2>Latest Projects</h2>
      <div className="cards-grid">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </Window>
  )
}
