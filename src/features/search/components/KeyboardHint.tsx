import type { ReactNode } from 'react'

interface KeyboardHintProps {
  keys: ReactNode
  label: string
}

export function KeyboardHint({ keys, label }: KeyboardHintProps) {
  return (
    <span className="flex items-center gap-1">
      {keys}
      <span>{label}</span>
    </span>
  )
}

export function KeyCap({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded bg-stone-100 px-2 py-1 font-mono text-stone-600">
      {children}
    </kbd>
  )
}
