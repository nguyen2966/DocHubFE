import { PencilSimpleLine, WarningCircle } from '@phosphor-icons/react'
import { LoaderCircle } from 'lucide-react'
import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import type { Document } from '../../types/document.type'
import { useRenameDocument } from '../../hooks/useRenameDocument'
import { canRenameDocument } from '../../utils/documents.permission.util'
import { renameDocumentSchema } from '../../schema/document.schema'
import { Tooltips } from '../../../../shared/components/ui/Tooltips'
import { ConfirmModal } from '../../../../shared/components/ui/ConfirmModal'

interface DocumentTitleBarProps {
  workspaceId: string
  document: Document
  isPdfEditing: boolean
  isSavingPdf: boolean
  onCancelEditPdf: () => void
  onSavePdf: () => void
}

export function DocumentTitleBar({
  workspaceId,
  document,
  isPdfEditing,
  isSavingPdf,
  onCancelEditPdf,
  onSavePdf,
}: DocumentTitleBarProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(document.title)
  const [error, setError] = useState<string | null>(null)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [editInputWidth, setEditInputWidth] = useState(160)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const titleMeasureRef = useRef<HTMLHeadingElement | null>(null)
  const skipBlurSaveRef = useRef(false)
  const renameDocument = useRenameDocument(workspaceId)
  const canRename = canRenameDocument(document)
  const isSaving = renameDocument.isPending

  useEffect(() => {
    if (!editing) {
      setDraft(document.title)
      setError(null)
    }
  }, [document.title, editing])

  useEffect(() => {
    if (!editing) return

    inputRef.current?.focus()
    inputRef.current?.select()
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

  const startRename = () => {
    const measuredWidth = titleMeasureRef.current?.offsetWidth ?? 0
    const nextWidth = Math.min(Math.max(measuredWidth + 28, 120), 360)

    setEditInputWidth(nextWidth)
    setEditing(true)
  }

  const cancelEdit = () => {
    if (isSaving) return

    skipBlurSaveRef.current = true
    setDraft(document.title)
    setError(null)
    setEditing(false)
  }

  const saveEdit = () => {
    if (isSaving) return
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
          setError(null)
        },
        onError: (mutationError) => {
          setError(getRenameErrorMessage(mutationError))
          inputRef.current?.focus()
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
    if (isSaving) return

    if (skipBlurSaveRef.current) {
      skipBlurSaveRef.current = false
      return
    }

    saveEdit()
  }

  const handleConfirmDiscard = () => {
    setDiscardOpen(false)
    onCancelEditPdf()
  }

  return (
    <div className="flex min-h-14 items-center justify-between gap-3 border-b border-stone-200 px-5 py-2">
      <div className="min-w-0 flex flex-1 items-center gap-2">
        {editing ? (
          <Tooltips
            text={error}
            open={Boolean(error)}
            placement="right"
            className="max-w-full"
          >
            <input
              ref={inputRef}
              value={draft}
              disabled={isSaving}
              onChange={(event) => handleDraftChange(event.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              aria-invalid={Boolean(error)}
              style={{ width: editInputWidth }}
              className={`h-9 max-w-full rounded-lg border px-3 text-lg font-semibold text-stone-950 outline-none transition ${
                error
                  ? 'border-red-500 bg-red-50/70 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200'
                  : 'border-stone-300 focus:border-stone-500'
              }`}
            />
          </Tooltips>
        ) : (
          <h1
            ref={titleMeasureRef}
            className="max-w-full truncate text-lg font-semibold text-stone-950"
          >
            {document.title}
          </h1>
        )}

        {canRename && !editing && (
          <Tooltips text="Rename" placement="bottom">
            <button
              type="button"
              onClick={startRename}
              className="shrink-0 rounded-md p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              aria-label="Rename document"
            >
              <PencilSimpleLine size={16} />
            </button>
          </Tooltips>
        )}

        {isSaving && (
          <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-stone-500">
            <LoaderCircle size={14} className="animate-spin" />
            <span>Saving...</span>
          </div>
        )}
      </div>

      {isPdfEditing && (
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setDiscardOpen(true)}
            disabled={isSavingPdf}
            className="h-8 rounded-lg border border-stone-200 bg-white px-3 text-sm font-medium text-stone-900 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Discard changes
          </button>

          <button
            type="button"
            className="h-8 rounded-lg bg-stone-900 px-3 text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onSavePdf}
            disabled={isSavingPdf}
          >
            Done
          </button>
        </div>
      )}

      <ConfirmModal
        open={discardOpen}
        title="Discard unsaved changes?"
        description="You have unsaved changes. Leaving now will discard them. Leave anyway?"
        cancelText="Keep editing"
        confirmText="Discard"
        confirmButtonClassName="bg-red-50 text-red-600 hover:bg-red-100"
        icon={
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <WarningCircle size={22} weight="bold" />
          </div>
        }
        onClose={() => setDiscardOpen(false)}
        onConfirm={handleConfirmDiscard}
      />
    </div>
  )
}

function getRenameErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string | string[] }
      | undefined
    const message = responseData?.message

    if (Array.isArray(message)) return message[0] ?? 'Failed to rename document'
    if (message) return message
  }

  return 'Failed to rename document'
}
