"use client"

import { useTheme } from "next-themes"
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut"

export function DarkModeShortcut() {
  const { theme, setTheme } = useTheme()

  // Toggle dark mode with Cmd/Ctrl + K
  useKeyboardShortcut('k', () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, { cmd: true, ctrl: true })

  return null
}