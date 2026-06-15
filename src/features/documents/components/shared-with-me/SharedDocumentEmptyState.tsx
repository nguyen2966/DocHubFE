export function SharedDocumentEmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50">
      <p className="text-sm font-medium text-stone-900">
        No shared documents yet
      </p>

      <p className="mt-1 text-sm text-stone-500">
        Documents shared with you will appear here.
      </p>
    </div>
  )
}