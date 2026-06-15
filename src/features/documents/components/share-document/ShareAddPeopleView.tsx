import { useMemo, useState } from 'react'
import type {
  SearchDocumentUserResult,
  ShareRole,
} from '../../types/document.type'
import { useSearchDocumentUsers } from '../../hooks/useSearchDocumentUser'
import { useShareDocumentAccess } from '../../hooks/useSharedDocumentAccess'
import { ShareRoleSelect } from './ShareRoleSelect'
import { ShareUserSearchDropdown } from './ShareUserSearchDropDown'
import { ShareSelectedUserPill } from './ShareSelectedUserPill'

interface Props {
  workspaceId: string
  documentId: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function ShareAddPeopleBar({ workspaceId, documentId }: Props) {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<ShareRole>('viewer')
  const [selectedUsers, setSelectedUsers] = useState<SearchDocumentUserResult[]>([])

  const trimmedQuery = query.trim()
  const searchQuery = useSearchDocumentUsers(workspaceId, documentId, trimmedQuery)
  const shareMutation = useShareDocumentAccess(workspaceId, documentId)

  const selectedEmails = useMemo(
    () => selectedUsers.map((user) => user.email.toLowerCase()),
    [selectedUsers],
  )

  const fallbackUnregistered: SearchDocumentUserResult[] =
    isValidEmail(trimmedQuery) && !searchQuery.data?.results.length
      ? [
          {
            email: trimmedQuery.toLowerCase(),
            isRegistered: false,
            isWorkspaceMember: false,
            isOwner: false,
            explicitDocumentRole: null,
            effectiveDocumentRole: null,
            canBeShared: true,
            disabledReason: null,
          },
        ]
      : []

  const results = searchQuery.data?.results.length
    ? searchQuery.data.results
    : fallbackUnregistered

  const showDropdown = trimmedQuery.length > 0

  const handleSelect = (user: SearchDocumentUserResult) => {
    if (!user.canBeShared) return

    const email = user.email.toLowerCase()

    if (selectedEmails.includes(email)) return

    setSelectedUsers((prev) => [...prev, { ...user, email }])
    setQuery('')
  }

  const handleAdd = async () => {
    if (!selectedUsers.length) return

    await shareMutation.mutateAsync({
      emails: selectedUsers.map((user) => user.email),
      role,
    })

    setSelectedUsers([])
    setQuery('')
    console.log('Document access shared')
  }

  return (
    <div className="relative">
      <p className="mb-3 text-lg font-semibold text-stone-900">
        Add people by email
      </p>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <div className="flex min-h-[48px] items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 shadow-sm focus-within:border-stone-400">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              {selectedUsers.map((user) => (
                <ShareSelectedUserPill
                  key={user.email}
                  user={user}
                  onRemove={() =>
                    setSelectedUsers((prev) =>
                      prev.filter((item) => item.email !== user.email),
                    )
                  }
                />
              ))}

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  selectedUsers.length ? '' : 'Enter email addresses...'
                }
                className="min-w-[160px] flex-1 border-none bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400"
              />
            </div>

            <ShareRoleSelect value={role} onChange={setRole} variant="inline" />
          </div>

          {showDropdown && (
            <ShareUserSearchDropdown
              results={results}
              loading={searchQuery.isFetching}
              selectedEmails={selectedEmails}
              onSelect={handleSelect}
            />
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedUsers.length || shareMutation.isPending}
          className="h-12 rounded-xl bg-stone-950 px-5 text-base font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {shareMutation.isPending ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  )
}