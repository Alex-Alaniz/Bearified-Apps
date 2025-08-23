import { useEffect } from 'react'

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options?: {
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    cmd?: boolean
  }
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { ctrl = false, shift = false, alt = false, cmd = false } = options || {}

      const isCtrlPressed = ctrl ? event.ctrlKey : !event.ctrlKey
      const isShiftPressed = shift ? event.shiftKey : !event.shiftKey
      const isAltPressed = alt ? event.altKey : !event.altKey
      const isCmdPressed = cmd ? event.metaKey : !event.metaKey

      if (
        event.key?.toLowerCase() === key.toLowerCase() &&
        isCtrlPressed &&
        isShiftPressed &&
        isAltPressed &&
        isCmdPressed
      ) {
        event.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [key, callback, options])
}