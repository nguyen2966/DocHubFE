import type { SearchDocumentUserResult } from '../../types/document.type'
import { getDisabledReasonLabel } from '../../utils/shared-disable-reason'
import { UserAvatar } from '../../../../shared/components/UserAvatar'

interface Props {
  results: SearchDocumentUserResult[]
  loading?: boolean
  selectedEmails: string[]
  onSelect: (user: SearchDocumentUserResult) => void
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
              className="flex h-[60px] w-full items-center gap-3 px-5 text-left hover:bg-stone-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <UserAvatar
                src={user.avatarUrl}
                name={user.fullName ?? user.email}
                size="sm"
                className={[
                  'h-8 w-8 shrink-0 rounded-full object-cover',
                  disabled ? 'opacity-50' : '',
                ].join(' ')}
              />

              <div className="flex h-full min-w-0 flex-1 flex-col justify-center">
                <div className="flex items-center gap-2">
                  <p
                    className={[
                      'truncate text-[16px] font-semibold leading-5',
                      disabled ? 'text-stone-500' : 'text-stone-950',
                    ].join(' ')}
                  >
                    {user.isRegistered
                      ? user.fullName || user.email
                      : user.email}
                  </p>

                  {!user.isRegistered && (
                    <span className="shrink-0 text-[16px] font-semibold leading-5 text-red-500">
                      (Pending user)
                    </span>
                  )}

                  {user.disabledReason && (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[16px] leading-5 text-stone-500">
                      {getDisabledReasonLabel(user.disabledReason)}
                    </span>
                  )}

                  {selected && (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[16px] leading-5 text-stone-500">
                      Selected
                    </span>
                  )}
                </div>

                <p
                  className={[
                    'truncate text-[16px] leading-5',
                    disabled ? 'text-stone-400' : 'text-stone-500',
                  ].join(' ')}
                >
                  {user.email}
                </p>
              </div>
            </button>
          )
        })}
    </div>
  )
}
