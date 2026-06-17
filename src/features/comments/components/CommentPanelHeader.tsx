import { X } from '@phosphor-icons/react'

interface CommentPanelHeaderProps {
  count: number
  onClose: () => void
}

export function CommentPanelHeader({ count, onClose }: CommentPanelHeaderProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-stone-200 px-4">
      <div>
        <h2 className="text-sm font-semibold text-stone-950">Comments</h2>
        <p className="text-[11px] text-stone-400">
          {count} {count === 1 ? 'comment' : 'comments'}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
      >
        <X size={16} />
      </button>
    </div>
  )
}