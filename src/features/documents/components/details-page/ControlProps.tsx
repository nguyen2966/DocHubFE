import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';

interface PdfPageControlsProps {
  currentPage: number
  pageCount: number
  onGoToPage: (page: number) => void
}

export function PdfPageControls({
  currentPage,
  pageCount,
  onGoToPage,
}: PdfPageControlsProps) {
  return (
    <div className="shrink-0 flex h-12 items-center justify-center gap-3 border-t border-stone-200 bg-white text-sm text-stone-700">
      <button disabled={currentPage <= 1} onClick={() => onGoToPage(1)}>
        <CaretDoubleLeft size={16} />
      </button>

      <button disabled={currentPage <= 1} onClick={() => onGoToPage(currentPage - 1)}>
        <CaretLeft size={16} />
      </button>

      <div className="flex items-center gap-1">
        <span className="min-w-8 rounded-lg border border-stone-200 px-2 py-1 text-center">
          {currentPage}
        </span>
        <span>/</span>
        <span>{pageCount}</span>
      </div>

      <button disabled={currentPage >= pageCount} onClick={() => onGoToPage(currentPage + 1)}>
        <CaretRight size={16} />
      </button>

      <button disabled={currentPage >= pageCount} onClick={() => onGoToPage(pageCount)}>
        <CaretDoubleRight size={16} />
      </button>
    </div>
  )
}