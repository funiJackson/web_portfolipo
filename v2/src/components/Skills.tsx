import { SKILLS } from '../data/projects'
import { Window } from './Window'

export function Skills() {
  return (
    <Window id="skills" title="~/skills" tag={String(SKILLS.length)}>
      <p className="prompt">cat stack.toml</p>
      <h2>Skills</h2>

      <dl className="skills">
        {SKILLS.map(group => (
          <div className="skill-row" key={group.area}>
            <dt>{group.area}</dt>
            <dd>
              <div className="tech-list">
                {group.items.map(item => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </Window>
  )
}
