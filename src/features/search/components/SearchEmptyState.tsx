import DocNotFound from '../../../assets/doc_notfound.png';

interface SearchEmptyStateProps {
  message?: string
  description?: string
}

export function SearchEmptyState({
  message = "Hmm, we couldn't find that.",
  description = 'Try different keywords or adjust your active filters.',
}: SearchEmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-10">
      <div className="flex w-60 h-60 items-center justify-center rounded-full bg-stone-100 text-stone-300">
        <img src={DocNotFound} alt="Document not found" />
      </div>
      <div className="text-center">
        <div className="font-medium text-stone-900">{message}</div>
        <div className="mt-1 text-sm text-stone-500">{description}</div>
      </div>
    </div>
  )
}
