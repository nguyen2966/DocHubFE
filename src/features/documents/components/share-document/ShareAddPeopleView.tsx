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
import { useDebouncedValue } from '../../../search/hooks/useDebouncedValue'

interface Props {
  workspaceId: string
  documentId: string
}

function isValidEmail(email: string) {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
}

export function ShareAddPeopleBar({ workspaceId, documentId }: Props) {
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<ShareRole>('viewer')
  const [selectedUsers, setSelectedUsers] = useState<SearchDocumentUserResult[]>([])

  const debouncedQuery = useDebouncedValue(query, 300)
  const trimmedQuery = query.trim()
  const debouncedTrimmedQuery = debouncedQuery.trim()
  const searchQuery = useSearchDocumentUsers(
    workspaceId,
    documentId,
    debouncedTrimmedQuery,
  )
  const shareMutation = useShareDocumentAccess(workspaceId, documentId)

  const selectedEmails = useMemo(
    () => selectedUsers.map((user) => user.email.toLowerCase()),
    [selectedUsers],
  )

  const fallbackUnregistered: SearchDocumentUserResult[] =
    isValidEmail(debouncedTrimmedQuery) && !searchQuery.data?.results.length
      ? [
          {
            email: debouncedTrimmedQuery.toLowerCase(),
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
      <p className="mb-2 text-sm font-semibold text-stone-900">
        Add people by email
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="flex min-h-10 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 shadow-sm focus-within:border-stone-400">
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
                className="min-w-[150px] flex-1 border-none bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
              />
            </div>

            <div className="self-start">
              <ShareRoleSelect
                value={role}
                onChange={setRole}
                variant="inline"
              />
            </div>
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
          className="h-10 rounded-lg bg-stone-950 px-4 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {shareMutation.isPending ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  )
}
