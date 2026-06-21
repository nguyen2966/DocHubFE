import { PencilSimple } from '@phosphor-icons/react'
import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import type { Document } from '../../types/document.type'
import { useRenameDocument } from '../../hooks/useRenameDocument'
import { canRenameDocument } from '../../utils/documents.permission.util'
import { renameDocumentSchema } from '../../schema/document.schema'

interface DocumentTitleBarProps {
  workspaceId: string
  document: Document
}

export function DocumentTitleBar({
  workspaceId,
  document,
}: DocumentTitleBarProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(document.title)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const skipBlurSaveRef = useRef(false)
  const renameDocument = useRenameDocument(workspaceId)
  const canRename = canRenameDocument(document)

  useEffect(() => {
    if (!editing) {
      setDraft(document.title)
      setError(null)
    }
  }, [document.title, editing])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const validate = (nextDraft: string) => {
    const result = renameDocumentSchema.safeParse({ title: nextDraft })
    const nextError = result.success
      ? null
      : result.error.flatten().fieldErrors.title?.[0] ?? null

    setError(nextError)
    return !nextError
  }

  const handleDraftChange = (value: string) => {
    setDraft(value)
    validate(value)
  }

  const cancelEdit = () => {
    skipBlurSaveRef.current = true
    setDraft(document.title)
    setError(null)
    setEditing(false)
  }

  const saveEdit = () => {
    if (!validate(draft)) return

    const title = draft.trim()
    if (title === document.title) {
      setEditing(false)
      return
    }

    renameDocument.mutate(
      {
        documentId: document._id,
        payload: { title },
      },
      {
        onSuccess: () => {
          setEditing(false)
        },
      },
    )
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      saveEdit()
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      cancelEdit()
      inputRef.current?.blur()
    }
  }

  const handleBlur = () => {
    if (skipBlurSaveRef.current) {
      skipBlurSaveRef.current = false
      return
    }

    saveEdit()
  }

  return (
    <div className="flex min-h-14 items-center gap-3 border-b border-stone-200 px-5 py-2">
      <div className="min-w-0 flex-1">
        {editing ? (
          <>
            <input
              ref={inputRef}
              value={draft}
              disabled={renameDocument.isPending}
              onChange={(event) => handleDraftChange(event.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              aria-invalid={Boolean(error)}
              className={`w-full rounded-lg border px-3 py-1.5 text-lg font-semibold text-stone-950 outline-none ${
                error
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-stone-300 focus:border-stone-500'
              }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </>
        ) : (
          <h1 className="truncate text-lg font-semibold text-stone-950">
            {document.title}
          </h1>
        )}
      </div>

      {canRename && !editing && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-md p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
          aria-label="Rename document"
        >
          <PencilSimple size={16} />
        </button>
      )}
    </div>
  )
}
