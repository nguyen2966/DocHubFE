import { X } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { renameDocumentSchema } from '../../schema/document.schema'

interface RenameModalProps {
  open: boolean
  title?: string
  initialValue: string
  loading?: boolean

  onClose: () => void
  onSubmit: (value: string) => void
}

export function RenameModal({
  open,
  title = 'Rename document',
  initialValue,
  loading = false,
  onClose,
  onSubmit,
}: RenameModalProps) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValue(initialValue)
    setError(null)
  }, [initialValue, open])

  const validate = (nextValue: string) => {
    const result = renameDocumentSchema.safeParse({ title: nextValue })
    const nextError = result.success
      ? null
      : result.error.flatten().fieldErrors.title?.[0] ?? null

    setError(nextError)
    return !nextError
  }

  const handleChange = (nextValue: string) => {
    setValue(nextValue)
    validate(nextValue)
  }

  const handleSubmit = () => {
    if (!validate(value)) return
    onSubmit(value.trim())
  }

  const canSave =
    value.trim().length > 0 &&
    !error &&
    value.trim() !== initialValue.trim() &&
    !loading

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex h-[176px] w-[425px] flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="text-lg font-medium text-stone-900">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-stone-500 hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-3">
          <div className="relative">
            <input
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              aria-invalid={Boolean(error)}
              className={`h-10 w-full rounded-xl border px-3 pr-9 text-sm outline-none transition-all focus:border-2 focus:shadow-[0_0_0_4px_rgba(120,113,108,0.18)] ${
                error
                  ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.16)]'
                  : 'border-stone-300 focus:border-stone-500'
              }`}
            />

            {value && (
              <button
                type="button"
                onClick={() => handleChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>

        <div className="mt-auto flex justify-end gap-2 border-t border-stone-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-9 rounded-lg border border-stone-300 px-4 text-sm font-medium hover:bg-stone-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!canSave}
            onClick={handleSubmit}
            className={`h-9 rounded-lg px-4 text-sm font-medium transition ${
              canSave
                ? 'bg-stone-950 text-white hover:bg-stone-800'
                : 'cursor-not-allowed bg-stone-400 text-white opacity-50'
            }`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
