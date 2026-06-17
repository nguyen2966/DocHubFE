export function CommentEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500">
        💬
      </div>
      <p className="text-sm font-medium text-stone-700">No comments yet</p>
      <p className="mt-1 text-xs leading-relaxed text-stone-400">
        Select text or click an annotation to start a discussion.
      </p>
    </div>
  )
}