import { PaperPlaneTilt } from '@phosphor-icons/react'
import { FormEvent, useState } from 'react'

interface CommentReplyInputProps {
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  onSubmit: (body: string) => void
}

export function CommentReplyInput({
  placeholder = 'Reply...',
  disabled,
  autoFocus,
  onSubmit,
}: CommentReplyInputProps) {
  const [body, setBody] = useState('')

  const canSubmit = body.trim().length > 0 && !disabled

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const trimmed = body.trim()
    if (!trimmed || disabled) return

    onSubmit(trimmed)
    setBody('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-2 py-1 shadow-sm focus-within:border-stone-400"
    >
      <input
        autoFocus={autoFocus}
        value={body}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => setBody(event.target.value)}
        className="min-w-0 flex-1 bg-transparent px-1 text-sm text-stone-800 outline-none placeholder:text-stone-400 disabled:cursor-not-allowed"
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        <PaperPlaneTilt size={15} weight="bold" />
      </button>
    </form>
  )
}