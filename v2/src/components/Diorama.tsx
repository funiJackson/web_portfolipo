import { useEffect, useMemo, useRef } from 'react'

/**
 * The backdrop: a pixel forest at night, drawn on the same block grid as the
 * project icons so the whole page speaks one language.
 *
 * Three bands of conifers — far, mid, near — each darker and taller than the
 * one behind it, with fog between them, fireflies in the near air, and a slow
 * parallax as you scroll. Everything is SVG rects: no images, no filters.
 */

const CELL = 4 // one pixel of the art, in viewBox units
const WIDTH = 480

export function Diorama() {
  const sceneRef = useRef<HTMLDivElement>(null)

  // parallax: the far band barely moves, the near band drifts
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sceneRef.current?.style.setProperty('--scroll', String(window.scrollY))
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const far = useMemo(
    () => treeline({ seed: 3, count: 54, minRows: 4, maxRows: 8, baseY: 198, jitter: 10 }),
    []
  )
  const mid = useMemo(
    () => treeline({ seed: 17, count: 32, minRows: 7, maxRows: 13, baseY: 232, jitter: 14 }),
    []
  )
  const near = useMemo(
    () => treeline({ seed: 29, count: 15, minRows: 13, maxRows: 22, baseY: 272, jitter: 18 }),
    []
  )

  const fireflies = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        x: `${(i * 41) % 100}%`,
        y: `${38 + ((i * 57) % 58)}%`,
        dur: `${9 + ((i * 5) % 11)}s`,
        delay: `-${(i * 3) % 14}s`,
        warm: i % 4 === 0,
      })),
    []
  )

  return (
    <div className="scene" ref={sceneRef} aria-hidden="true">
      <svg className="forest" viewBox="0 0 480 300" preserveAspectRatio="xMidYMax slice">
        <defs>
          {/* haze has no edges — it fades in and out of the band it sits in */}
          <linearGradient id="fog-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--green)" stopOpacity={0} />
            <stop offset="50%" stopColor="var(--green)" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--green)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <Stars />

        {/* a blocky moon over the right-hand trees */}
        <g className="moon">
          <rect x={388} y={36} width={16} height={16} />
          <rect x={384} y={40} width={4} height={8} />
          <rect x={404} y={40} width={4} height={8} />
          <rect x={392} y={32} width={8} height={4} />
          <rect x={392} y={52} width={8} height={4} />
        </g>

        <rect className="fog fog-far" fill="url(#fog-grad)" x={0} y={166} width={WIDTH} height={46} />
        <Band trees={far} className="band-far" />

        <rect className="fog fog-mid" fill="url(#fog-grad)" x={0} y={202} width={WIDTH} height={48} />
        <Band trees={mid} className="band-mid" />

        <rect className="fog fog-near" fill="url(#fog-grad)" x={0} y={244} width={WIDTH} height={56} />
        <Band trees={near} className="band-near" />

        <rect className="floor" x={0} y={288} width={WIDTH} height={12} />
      </svg>

      <div className="fireflies">
        {fireflies.map((f, i) => (
          <span
            key={i}
            className={f.warm ? 'warm' : undefined}
            style={
              { left: f.x, top: f.y, '--dur': f.dur, '--delay': f.delay } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="scene-vignette" />
    </div>
  )
}

interface Tree {
  x: number
  baseY: number
  rows: number
  litLeft: boolean
}

function Band({ trees, className }: { trees: Tree[]; className: string }) {
  return (
    <g className={`band ${className}`}>
      {trees.map((tree, i) => (
        <Conifer key={i} tree={tree} />
      ))}
    </g>
  )
}

/**
 * A stepped pixel fir: the rows widen by two cells every second row, one cell
 * on the moonward edge catches the light, and a two-cell trunk holds it up.
 */
function Conifer({ tree }: { tree: Tree }) {
  const { x, baseY, rows, litLeft } = tree
  const blocks: React.ReactElement[] = []

  for (let row = 0; row < rows; row += 1) {
    const width = 1 + 2 * Math.floor(row / 2)
    const y = baseY - (rows - row) * CELL
    const left = x - Math.floor(width / 2) * CELL

    blocks.push(<rect key={`r${row}`} x={left} y={y} width={width * CELL} height={CELL} />)

    if (row > 2 && row % 2 === 0) {
      blocks.push(
        <rect
          key={`l${row}`}
          className="lit"
          x={litLeft ? left : left + (width - 1) * CELL}
          y={y}
          width={CELL}
          height={CELL}
        />
      )
    }
  }

  blocks.push(<rect key="trunk" x={x - CELL / 2} y={baseY} width={CELL} height={CELL * 2} />)

  return <g>{blocks}</g>
}

function Stars() {
  const stars = useMemo(() => {
    const rnd = seeded(20260921)
    return Array.from({ length: 46 }, () => ({
      x: Math.round((rnd() * WIDTH) / CELL) * CELL,
      y: Math.round((rnd() * 160) / CELL) * CELL,
      bright: rnd() < 0.22,
    }))
  }, [])

  return (
    <g className="stars">
      {stars.map((s, i) => (
        <rect
          key={i}
          x={s.x}
          y={s.y}
          width={CELL}
          height={CELL}
          className={s.bright ? 'bright' : undefined}
          style={{ animationDelay: `${(i % 7) * 0.8}s` }}
        />
      ))}
    </g>
  )
}

/** Lays out one band of firs: snapped to the cell grid, clustered, never even. */
function treeline({
  seed,
  count,
  minRows,
  maxRows,
  baseY,
  jitter,
}: {
  seed: number
  count: number
  minRows: number
  maxRows: number
  baseY: number
  jitter: number
}): Tree[] {
  const trees: Tree[] = []
  const span = maxRows - minRows
  const rnd = seeded(seed)

  for (let i = 0; i < count; i += 1) {
    const x =
      Math.round(
        ((i + 0.5) * (WIDTH / count) + (rnd() - 0.5) * jitter * 2) / CELL
      ) * CELL
    trees.push({
      x,
      baseY: baseY + Math.round(rnd() * 2 - 1) * CELL,
      rows: minRows + Math.floor(rnd() * (span + 1)),
      litLeft: x > 390, // the moon is over on the right
    })
  }

  // tall ones first, so the short ones overlap in front of them
  return trees.sort((a, b) => b.rows - a.rows)
}

/** Small deterministic PRNG — the same forest grows on every visit. */
function seeded(seed: number) {
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}
