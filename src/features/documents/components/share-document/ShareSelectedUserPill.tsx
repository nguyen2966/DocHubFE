import { X } from '@phosphor-icons/react'
import type { SearchDocumentUserResult } from '../../types/document.type'

interface Props {
  user: SearchDocumentUserResult
  onRemove: () => void
}

export function ShareSelectedUserPill({ user, onRemove }: Props) {
  return (
    <span className="inline-flex max-w-[220px] items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700">
      <span className="truncate">{user.fullName || user.email}</span>

      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 text-stone-400 hover:text-stone-800"
      >
        <X size={14} />
      </button>
    </span>
  )
}