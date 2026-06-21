import { ArrowUp } from '@phosphor-icons/react'
import { FormEvent, useEffect, useRef, useState } from 'react'
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
  const rootRef = useRef<HTMLDivElement | null>(null)
  const isInline = variant === 'inline'
  const canSubmit = body.trim().length > 0 && !error && !disabled

  useEffect(() => {
    if (!onCancel) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current) return
      if (rootRef.current.contains(event.target as Node)) return
      onCancel()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [onCancel])

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
    <div ref={rootRef} className="space-y-1">
      <form
        onSubmit={handleSubmit}
        className={
          isInline
            ? `flex w-[360px] max-w-[calc(100vw-32px)] items-center gap-2 rounded-full border bg-white/95 px-2 py-1.5 shadow-md backdrop-blur transition ${
                error
                  ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100'
                  : 'border-stone-300 focus-within:border-stone-950 focus-within:ring-2 focus-within:ring-stone-100'
              }`
            : `flex w-[280px] items-center gap-2 rounded-full border bg-white px-2 py-1.5 shadow-sm transition ${
                error
                  ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100'
                  : 'border-stone-300 focus-within:border-stone-950 focus-within:ring-2 focus-within:ring-stone-100'
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
              ? 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400'
              : 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400'
          }
        >
          <ArrowUp size={15} weight="bold" />
        </button>
      </form>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
