import { useMemo } from 'react'
import { ICONS } from '../data/icons'
import type { IconName } from '../data/projects'

interface Cell {
  x: number
  y: number
  kind: 'solid' | 'lit' | 'dim'
  blinks: boolean
  delay: number
}

export function Mosaic({ icon }: { icon: IconName }) {
  const cells = useMemo<Cell[]>(() => {
    const grid = ICONS[icon]
    const out: Cell[] = []

    grid.forEach((row, y) => {
      row.split('').forEach((char, x) => {
        out.push({
          x,
          y,
          kind: char === '#' ? 'solid' : char === '*' ? 'lit' : 'dim',
          // a handful of empty tiles blink like dead pixels
          blinks: char === '.' && (x * 7 + y * 3) % 11 === 0,
          // hover sweeps the empty tiles diagonally
          delay: (x + y) * 45,
        })
      })
    })

    return out
  }, [icon])

  return (
    <div className="mosaic" aria-hidden="true">
      <svg viewBox="0 0 100 100">
        {cells.map(cell => (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x * 10 + 0.8}
            y={cell.y * 10 + 0.8}
            width={8.4}
            height={8.4}
            rx={1.2}
            className={
              cell.kind === 'solid'
                ? undefined
                : cell.kind === 'lit'
                  ? 'lit'
                  : cell.blinks
                    ? 'dim flicker'
                    : 'dim'
            }
            style={
              cell.kind === 'dim'
                ? ({ '--d': cell.delay } as React.CSSProperties)
                : undefined
            }
          />
        ))}
      </svg>
    </div>
  )
}
