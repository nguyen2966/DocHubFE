import { useEffect } from 'react'

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false

  const tagName = target.tagName.toLowerCase()
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.isContentEditable
  )
}

export function useGlobalSearchShortcut({
  open,
  onOpen,
  onClose,
}: {
  open: boolean
  onOpen: () => void
  onClose: () => void
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const isSearchInput = target?.dataset.globalSearchInput === 'true'

      if (event.key === 'Escape' && open) {
        event.preventDefault()
        onClose()
        return
      }

      if (
        event.key?.toLowerCase() === 'k' &&
        (event.metaKey || event.ctrlKey) &&
        (!isEditableTarget(event.target) || isSearchInput)
      ) {
        event.preventDefault()
        onOpen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onOpen, open])
}
