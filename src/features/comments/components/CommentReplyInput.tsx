import { ArrowUp } from '@phosphor-icons/react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { commentFormSchema } from '../schema/comment.schema'

interface CommentReplyInputProps {
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  onSubmit: (body: string) => void
  onCancel?: () => void
}

export function CommentReplyInput({
  placeholder = 'Reply...',
  disabled,
  autoFocus,
  onSubmit,
  onCancel,
}: CommentReplyInputProps) {
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

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

  const canSubmit = body.trim().length > 0 && !error && !disabled

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const trimmed = body.trim()
    if (!validate(body) || !trimmed || disabled) return

    onSubmit(trimmed)
    setBody('')
    setError(null)
  }

  return (
    <div ref={rootRef} className="space-y-1">
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-2 rounded-full border bg-white px-2 py-1 shadow-sm transition ${
          error
            ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100'
            : 'border-stone-300 focus-within:border-stone-950 focus-within:ring-2 focus-within:ring-stone-100'
        }`}
      >
        <input
          autoFocus={autoFocus}
          value={body}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => handleChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className="min-w-0 flex-1 bg-transparent px-1 text-sm text-stone-800 outline-none placeholder:text-stone-400 disabled:cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
        >
          <ArrowUp size={15} weight="bold" />
        </button>
      </form>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
