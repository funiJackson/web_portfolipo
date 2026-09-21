import { useEffect, useState } from 'react'

/**
 * Highlights the workspace pill for whichever section is in the middle band of
 * the viewport. Several sections can qualify at once, so the topmost wins.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.id
          if (entry.isIntersecting) visible.add(id)
          else visible.delete(id)
        })

        const first = ids.find(id => visible.has(id))
        if (first) setActive(first)
      },
      { rootMargin: '-40% 0px -40% 0px' }
    )

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [ids])

  return active
}
