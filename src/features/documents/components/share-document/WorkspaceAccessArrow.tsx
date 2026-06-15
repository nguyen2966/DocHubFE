import { Buildings } from '@phosphor-icons/react'

interface Props {
  workspaceName: string
  memberCount: number
}

export function WorkspaceAccessRow({ workspaceName, memberCount }: Props) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500">
          <Buildings size={22} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-stone-950">
            Everyone in {workspaceName}
          </p>
          <p className="text-base text-stone-500">{memberCount} people</p>
        </div>
      </div>

      <span className="shrink-0 text-base text-stone-500">Editor</span>
    </div>
  )
}