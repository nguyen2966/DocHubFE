import { useEffect } from 'react'

export function useSearchKeyboardNavigation({
  open,
  activeIndex,
  itemCount,
  onActiveIndexChange,
  onSelectActive,
  onClose,
}: {
  open: boolean
  activeIndex: number
  itemCount: number
  onActiveIndexChange: (index: number) => void
  onSelectActive: () => void
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (itemCount === 0) return
        onActiveIndexChange(Math.min(activeIndex + 1, itemCount - 1))
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (itemCount === 0) return
        onActiveIndexChange(Math.max(activeIndex - 1, 0))
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        if (itemCount > 0) onSelectActive()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    activeIndex,
    itemCount,
    onActiveIndexChange,
    onClose,
    onSelectActive,
    open,
  ])
}
