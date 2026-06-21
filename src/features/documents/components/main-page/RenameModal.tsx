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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[580px] rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-2xl font-medium text-stone-900">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-stone-500 hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="relative">
            <input
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              aria-invalid={Boolean(error)}
              className={`w-full rounded-2xl border-2 px-4 py-3 pr-10 text-lg outline-none ${
                error
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-stone-300 focus:border-stone-400'
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

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-stone-200 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-stone-300 px-5 py-2 text-lg font-medium hover:bg-stone-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!value.trim() || Boolean(error) || loading}
            onClick={handleSubmit}
            className="rounded-xl bg-stone-400 px-5 py-2 text-lg font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
