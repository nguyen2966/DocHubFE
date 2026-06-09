
import { InviteResult } from "../types/workspace.type"


export function EmailTag({
  email,
  result,
  onRemove,
}: {
  email: string
  result?: InviteResult
  onRemove: () => void
}) {
  const statusStyle = result
    ? result.status === 'invited' || result.status === 'already_invited'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
      : result.status === 'already_member'
      ? 'bg-amber-50 border-amber-200 text-amber-800'
      : 'bg-red-50 border-red-200 text-red-700'
    : 'bg-gray-100 border-gray-200 text-gray-700'

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-sm font-medium transition-colors ${statusStyle}`}>
      {email}
      {!result && (
        <button
          onClick={onRemove}
          className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
      {result && (
        <span className="text-xs opacity-70">
          {result.status === 'invited' ? '✓' :
           result.status === 'already_member' ? 'Already member' :
           result.status === 'already_invited' ? 'Re-sent' : 'Failed'}
        </span>
      )}
    </span>
  )
}
