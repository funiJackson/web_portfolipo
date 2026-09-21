export type Accent =
  | 'cyan'
  | 'green'
  | 'purple'
  | 'blue'
  | 'orange'
  | 'red'
  | 'yellow'

export type IconName =
  | 'wave'
  | 'shield'
  | 'spec'
  | 'coffee'
  | 'receipt'
  | 'car'
  | 'cart'
  | 'lift'

export interface Project {
  /** short lowercase handle — what you type in the terminal */
  id: string
  name: string
  date: string
  tags: string[]
  blurb: string
  live?: string
  repo?: string
  accent: Accent
  icon: IconName
}

export const PROJECTS: Project[] = [
  {
    id: 'riff',
    name: 'Riff',
    date: 'Aug, 2026',
    tags: ['TypeScript', 'OAuth / JWT', 'Paddle', 'LLM Pipeline'],
    blurb: 'An AI ghostwriting platform.',
    live: 'https://app.getriff.app/',
    accent: 'cyan',
    icon: 'wave',
  },
  {
    id: 'sage',
    name: 'SAGE Guardrail',
    date: 'Jul, 2026',
    tags: ['Python', 'RAG Security', 'LLM Evaluation'],
    blurb:
      'A layered guardrail that defends RAG generation pipelines against indirect prompt injection, evaluated with a 142-attack corpus and a replay harness.',
    live: 'https://github.com/funiJackson/SAGE-RAG-Guardrail',
    repo: 'https://github.com/funiJackson/SAGE-RAG-Guardrail',
    accent: 'red',
    icon: 'shield',
  },
  {
    id: 'specdev',
    name: 'Specdev-MCP',
    date: 'May, 2026',
    tags: ['Python', 'MCP', 'Pydantic'],
    blurb:
      'MCP tools and Claude Code slash commands for spec-driven development with .sdd contracts.',
    live: 'https://github.com/funiJackson/SpecMCP',
    repo: 'https://github.com/funiJackson/SpecMCP',
    accent: 'purple',
    icon: 'spec',
  },
  {
    id: 'coffee',
    name: 'Whistlestop Coffee Hut',
    date: 'Apr, 2026',
    tags: ['Next.js', 'Tailwind', 'Prisma / MariaDB', 'Zustand'],
    blurb: 'A coffee ordering app, built as a team of six.',
    live: 'https://whistlestop-coffee.vercel.app',
    repo: 'https://github.com/funiJackson/CSC8019---Software-engineering-project---Team-6-Code-Repository-/tree/main/whistlestop-coffee',
    accent: 'orange',
    icon: 'coffee',
  },
  {
    id: 'vmanage',
    name: 'Vmanage',
    date: 'Jan 31, 2026',
    tags: ['Java', 'Object Oriented Programming'],
    blurb: 'A vehicle management system.',
    live: 'https://github.com/funiJackson/CSC8014',
    repo: 'https://github.com/funiJackson/CSC8014',
    accent: 'blue',
    icon: 'car',
  },
  {
    id: 'receipts',
    name: 'Personal Finance Tracker',
    date: 'Sep, 2026',
    tags: ['React', 'FastAPI', 'Supabase', 'GPT-4o Vision'],
    blurb: 'A full-stack expense tracker.',
    live: 'https://github.com/funiJackson/Personal-Finance-Tracker',
    repo: 'https://github.com/funiJackson/Personal-Finance-Tracker',
    accent: 'green',
    icon: 'receipt',
  },
  {
    id: 'estore',
    name: 'E-store',
    date: 'Oct 8, 2025',
    tags: ['NextJs', 'JavaScript', 'Stripe & AWS'],
    blurb: 'A fullstack Estore Web App.',
    live: 'https://github.com/funiJackson/Estore',
    repo: 'https://github.com/funiJackson/Estore',
    accent: 'yellow',
    icon: 'cart',
  },
  {
    id: 'brogram',
    name: '30 Days Workout Brogram',
    date: 'Mar 23, 2025',
    tags: ['JavaScript', 'ReactJS', 'FantaCSS'],
    blurb: 'A smart fitness tracker.',
    live: 'https://jackson-workout-plan.netlify.app/',
    repo: 'https://github.com/funiJackson?tab=repositories',
    accent: 'orange',
    icon: 'lift',
  },
]

export interface SkillGroup {
  area: string
  items: string[]
}

export const SKILLS: SkillGroup[] = [
  {
    area: 'Programming & Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'HTML', 'CSS'],
  },
  {
    area: 'Frameworks & Libraries',
    items: ['React', 'Next.js', 'Flask', 'Django', 'REST APIs', 'LangChain', 'pytest'],
  },
  {
    area: 'Cloud, DevOps & Tools',
    items: [
      'Git/GitHub',
      'CI/CD',
      'Docker',
      'AWS',
      'Azure',
      'Vercel',
      'PostgreSQL',
      'Figma',
    ],
  },
  {
    area: 'AI / LLM',
    items: [
      'RAG',
      'Prompt Engineering',
      'LLM Evaluation',
      'AI Agents',
      'MCP',
      'Claude Code',
      'LLM APIs',
    ],
  },
]

export const PROFILE = {
  name: 'Jackson Zhou Fandi',
  role: 'Product Engineer',
  bio: 'I design it, build it, ship it — and make the AI behave.',
  email: 'C5052054@newcastle.ac.uk',
  github: 'https://github.com/funiJackson',
  linkedin: 'https://www.linkedin.com/in/fandi-zhou-55a259350/',
}
