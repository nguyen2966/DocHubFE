interface Props {
  workspaceId: string
  documentId: string
}

export function ShareLinkSection({ workspaceId, documentId }: Props) {
  const link = `${window.location.origin}/shared-with-me/documents/${documentId}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    console.log('Copied share link')
  }

  return (
    <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-stone-950">Share link</p>
        <p className="mt-1 text-sm text-stone-500">
          Only people with access can open this link.
        </p>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-950 hover:bg-stone-50"
      >
        Copy link
      </button>
    </div>
  )
}
