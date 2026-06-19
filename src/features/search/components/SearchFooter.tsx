import { KeyboardHint, KeyCap } from './KeyboardHint'

interface SearchFooterProps {
  total: number
  showCount: boolean
}

export function SearchFooter({ total, showCount }: SearchFooterProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-t border-stone-200 bg-white px-4 py-3 text-xs">
      <div className="text-stone-500">
        {showCount ? `${total} results found` : ''}
      </div>
      <div className="flex items-center gap-4 text-stone-400">
        <KeyboardHint
          keys={
            <>
              <KeyCap>↑</KeyCap>
              <KeyCap>↓</KeyCap>
            </>
          }
          label="to navigate"
        />
        <KeyboardHint keys={<KeyCap>↵</KeyCap>} label="to select" />
        <KeyboardHint keys={<KeyCap>Esc</KeyCap>} label="to close" />
      </div>
    </div>
  )
}
