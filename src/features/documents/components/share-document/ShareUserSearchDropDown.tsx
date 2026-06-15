import type { SearchDocumentUserResult } from '../../types/document.type'
import { getDisabledReasonLabel } from '../../utils/shared-disable-reason'

interface Props {
  results: SearchDocumentUserResult[]
  loading?: boolean
  selectedEmails: string[]
  onSelect: (user: SearchDocumentUserResult) => void
}

function getInitialLabel(user: SearchDocumentUserResult) {
  const label = user.fullName || user.email
  return label.charAt(0).toUpperCase()
}

export function ShareUserSearchDropdown({
  results,
  loading,
  selectedEmails,
  onSelect,
}: Props) {
  return (
    <div className="absolute left-0 top-[56px] z-20 max-h-[320px] w-full overflow-y-auto rounded-xl border border-stone-200 bg-white py-2 shadow-xl">
      {loading && (
        <div className="px-5 py-4 text-sm text-stone-500">Searching...</div>
      )}

      {!loading && results.length === 0 && (
        <div className="px-5 py-4 text-sm text-stone-500">No result</div>
      )}

      {!loading &&
        results.map((user) => {
          const selected = selectedEmails.includes(user.email.toLowerCase())
          const disabled = !user.canBeShared || selected

          return (
            <button
              key={user.userId ?? user.email}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(user)}
              className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-stone-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <div
                className={[
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                  disabled
                    ? 'bg-stone-100 text-stone-400'
                    : 'bg-stone-900 text-white',
                ].join(' ')}
              >
                {getInitialLabel(user)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={[
                      'truncate text-base font-semibold',
                      disabled ? 'text-stone-500' : 'text-stone-950',
                    ].join(' ')}
                  >
                    {user.isRegistered
                      ? user.fullName || user.email
                      : user.email}
                  </p>

                  {!user.isRegistered && (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-sm text-stone-500">
                      Unregistered
                    </span>
                  )}

                  {user.disabledReason && (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-sm text-stone-500">
                      {getDisabledReasonLabel(user.disabledReason)}
                    </span>
                  )}

                  {selected && (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-sm text-stone-500">
                      Selected
                    </span>
                  )}
                </div>

                <p
                  className={[
                    'truncate text-base',
                    disabled ? 'text-stone-400' : 'text-stone-500',
                  ].join(' ')}
                >
                  {user.isRegistered ? user.email : '[Unregistered User]'}
                </p>
              </div>
            </button>
          )
        })}
    </div>
  )
}