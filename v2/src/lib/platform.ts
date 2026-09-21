const isApple = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)

/** ⌘ on Apple hardware, Ctrl everywhere else. */
export const MOD_KEY = isApple() ? '⌘' : 'Ctrl'
