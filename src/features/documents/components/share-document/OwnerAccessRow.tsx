import type { DocumentAccessSummary } from '../../types/document.type'
import Avatar from '../../../../assets/avatar.png'

interface Props {
  owner: NonNullable<DocumentAccessSummary['owner']>
}

export function OwnerAccessRow({ owner }: Props) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={Avatar}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover"
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
