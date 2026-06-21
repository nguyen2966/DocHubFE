import { PaperPlaneTilt } from '@phosphor-icons/react'
import { FormEvent, useState } from 'react'
import { commentFormSchema } from '../schema/comment.schema'

interface CommentComposerProps {
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  variant?: 'default' | 'inline'
  onSubmit: (body: string) => void | Promise<void>
  onCancel?: () => void
}

export function CommentComposer({
  placeholder = 'Write a comment',
  disabled,
  autoFocus,
  variant = 'default',
  onSubmit,
  onCancel,
}: CommentComposerProps) {
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const isInline = variant === 'inline'
  const canSubmit = body.trim().length > 0 && !error && !disabled

  const validate = (nextBody: string) => {
    const result = commentFormSchema.safeParse({ content: nextBody })
    const nextError = result.success
      ? null
      : result.error.flatten().fieldErrors.content?.[0] ?? null

    setError(nextError)
    return !nextError
  }

  const handleChange = (nextBody: string) => {
    setBody(nextBody)
    validate(nextBody)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const trimmed = body.trim()
    if (!validate(body) || !trimmed || disabled) return

    await onSubmit(trimmed)
    setBody('')
    setError(null)
  }

  return (
    <div className="space-y-1">
      <form
        onSubmit={handleSubmit}
        className={
          isInline
            ? `flex w-[360px] max-w-[calc(100vw-32px)] items-center gap-2 rounded-xl border bg-white/95 px-2 py-1.5 shadow-xl backdrop-blur ${
                error
                  ? 'border-red-500 focus-within:border-red-500'
                  : 'border-stone-300 focus-within:border-stone-400'
              }`
            : `flex w-[280px] items-center gap-2 rounded-xl border bg-white px-2 py-1.5 shadow-xl ${
                error
                  ? 'border-red-500 focus-within:border-red-500'
                  : 'border-stone-300 focus-within:border-stone-400'
              }`
        }
      >
        <input
          autoFocus={autoFocus}
          value={body}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              onCancel?.()
            }
          }}
          aria-invalid={Boolean(error)}
          className={
            isInline
              ? 'min-w-0 flex-1 bg-transparent px-2 text-sm text-stone-800 outline-none placeholder:text-stone-400'
              : 'min-w-0 flex-1 bg-transparent px-1 text-sm text-stone-800 outline-none placeholder:text-stone-400'
          }
        />

        {onCancel && !isInline && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-2 py-1 text-xs text-stone-500 hover:bg-stone-100"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className={
            isInline
              ? 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-950 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300'
              : 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300'
          }
        >
          <PaperPlaneTilt size={15} weight="bold" />
        </button>
      </form>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
