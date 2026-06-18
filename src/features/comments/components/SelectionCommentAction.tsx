import { ChatCircleText } from '@phosphor-icons/react'

interface SelectionCommentActionProps {
  position: { x: number; y: number }
  onClick: () => void | Promise<void>
}

export function SelectionCommentAction({
  position,
  onClick,
}: SelectionCommentActionProps) {
  return (
    <div
      className="pointer-events-auto absolute z-50"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button
        type="button"
        aria-label="Add comment"
        onMouseDown={(event) => event.preventDefault()}
        onClick={(event) => {
          event.stopPropagation()
          void onClick()
        }}
        className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 shadow-lg transition hover:border-stone-300 hover:bg-stone-50"
      >
        <ChatCircleText size={18} weight="bold" />

        <span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 whitespace-nowrap rounded-lg bg-stone-950 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
          Add comment
          <span className="absolute left-1/2 top-[-4px] h-2 w-2 -translate-x-1/2 rotate-45 bg-stone-950" />
        </span>
      </button>
    </div>
  )
}
