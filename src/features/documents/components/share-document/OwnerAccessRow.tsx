import type { DocumentAccessSummary } from '../../types/document.type'
import { UserAvatar } from '../../../../shared/components/UserAvatar'

interface Props {
  owner: NonNullable<DocumentAccessSummary['owner']>
}

export function OwnerAccessRow({ owner }: Props) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex min-w-0 items-center gap-3">
        <UserAvatar
          src={owner.avatarUrl}
          name={owner.fullName}
          size="md"
          className="h-9 w-9 shrink-0"
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-950">
            {owner.fullName}
          </p>
          <p className="truncate text-sm text-stone-500">{owner.email}</p>
        </div>
      </div>

      <span className="shrink-0 text-sm text-stone-500">Doc owner</span>
    </div>
  )
}
