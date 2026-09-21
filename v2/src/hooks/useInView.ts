import { useEffect, useRef, useState } from 'react'

/** Reveals an element the first time it scrolls into view, then stops watching. */
export function useInView<T extends HTMLElement>(rootMargin = '-40px') {
  const ref = useRef<T>(null)
  const supported = typeof IntersectionObserver !== 'undefined'
  const [inView, setInView] = useState(!supported)

  useEffect(() => {
    const el = ref.current
    if (!el || !supported) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        observer.disconnect()
      },
      { rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, supported])

  return { ref, inView }
}
