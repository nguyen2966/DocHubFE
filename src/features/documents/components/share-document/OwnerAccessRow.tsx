import type { DocumentAccessSummary } from '../../types/document.type'

interface Props {
  owner: NonNullable<DocumentAccessSummary['owner']>
}

function getInitialLabel(name: string, email: string) {
  return (name || email).charAt(0).toUpperCase()
}

export function OwnerAccessRow({ owner }: Props) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">
          {getInitialLabel(owner.fullName, owner.email)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-stone-950">
            {owner.fullName}
          </p>
          <p className="truncate text-base text-stone-500">{owner.email}</p>
        </div>
      </div>

      <span className="shrink-0 text-base text-stone-500">Doc owner</span>
    </div>
  )
}