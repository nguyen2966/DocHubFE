import {
  ArrowBendDownRight,
  DotsThree,
  PencilSimple,
  Trash,
} from '@phosphor-icons/react'
import { FormEvent, useEffect, useRef, useState } from 'react'

import type { Comment, CommentThread } from '../utils/comment-tree.util'
import {
  isCommentDeleted,
} from '../utils/comment-tree.util'
import {
  canDeleteComment,
  canEditComment,
  canReplyToComment,
} from '../utils/comment-permission.util'
import type { CommentInteractionHandlers } from './comment-component.type'
import { TimestampTooltip } from './TimestamptToolTip';
import Avatar from '../../../assets/avatar.png';
import { commentFormSchema } from '../schema/comment.schema'

interface CommentItemProps extends CommentInteractionHandlers {
  thread: CommentThread
  comment: Comment
  currentUserId?: string | null
  isRoot?: boolean
  canDeleteWholeThread?: boolean
  editing?: boolean
}

export function CommentItem({
  thread,
  comment,
  currentUserId,
  isRoot,
  canDeleteWholeThread,
  editing,
  onStartReply,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onRequestDeleteComment,
  onRequestDeleteThread,
}: CommentItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [draft, setDraft] = useState(comment.body)
  const [draftError, setDraftError] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const deleted = isCommentDeleted(comment)

  const showEdit = canEditComment(comment, currentUserId)
  const showDeleteComment =
    !isRoot && canDeleteComment(comment, currentUserId)
  const showDeleteThread = Boolean(isRoot && canDeleteWholeThread)
  const showReply = canReplyToComment(comment)

  useEffect(() => {
    setDraft(comment.body)
    setDraftError(null)
  }, [comment.body, editing])

  useEffect(() => {
    if (!menuOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current) return
      if (menuRef.current.contains(event.target as Node)) return
      setMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [menuOpen])

  const validateDraft = (nextDraft: string) => {
    const result = commentFormSchema.safeParse({ content: nextDraft })
    const nextError = result.success
      ? null
      : result.error.flatten().fieldErrors.content?.[0] ?? null

    setDraftError(nextError)
    return !nextError
  }

  const handleDraftChange = (nextDraft: string) => {
    setDraft(nextDraft)
    validateDraft(nextDraft)
  }

  const handleSave = (event: FormEvent) => {
    event.preventDefault()

    const trimmed = draft.trim()
    if (!validateDraft(draft) || !trimmed) return

    onSaveEdit?.(comment, trimmed, thread)
  }

  return (
    <div className="group flex gap-2">
      <img
        src={Avatar}
        alt={"avatar"}
        className="h-7 w-7 rounded-full object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-xs font-semibold text-stone-900">
                {comment.author.fullName}
              </span>

              {!deleted && <TimestampTooltip comment={comment} />}
            </div>
          </div>

          {!deleted && (showEdit || showDeleteComment || showDeleteThread || showReply) && (
            <div ref={menuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                className="rounded-md p-1 text-stone-400 opacity-0 transition hover:bg-stone-100 hover:text-stone-700 group-hover:opacity-100"
              >
                <DotsThree size={16} weight="bold" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-7 z-50 w-40 overflow-hidden rounded-lg border border-stone-200 bg-white py-1 shadow-xl">
                  {showReply && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        onStartReply?.(comment, thread)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-stone-700 hover:bg-stone-50"
                    >
                      <ArrowBendDownRight size={14} />
                      Reply
                    </button>
                  )}

                  {showEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        onStartEdit?.(comment, thread)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-stone-700 hover:bg-stone-50"
                    >
                      <PencilSimple size={14} />
                      Edit
                    </button>
                  )}

                  {showDeleteComment && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        onRequestDeleteComment?.(comment, thread)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
                    >
                      <Trash size={14} />
                      Delete comment
                    </button>
                  )}

                  {showDeleteThread && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        onRequestDeleteThread?.(thread)
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
                    >
                      <Trash size={14} />
                      Delete thread
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {deleted ? (
          <p className="mt-1 text-xs italic text-stone-400">
            This comment has been deleted.
          </p>
        ) : editing ? (
          <form onSubmit={handleSave} className="mt-2 space-y-2">
            <textarea
              value={draft}
              onChange={(event) => handleDraftChange(event.target.value)}
              rows={3}
              aria-invalid={Boolean(draftError)}
              className={`w-full resize-none rounded-lg border px-3 py-2 text-sm text-stone-800 outline-none ${
                draftError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-stone-300 focus:border-stone-500'
              }`}
            />

            {draftError && (
              <p className="text-xs text-red-500">{draftError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancelEdit}
                className="rounded-md px-2 py-1 text-xs text-stone-500 hover:bg-stone-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!draft.trim() || Boolean(draftError)}
                className="rounded-md bg-stone-950 px-3 py-1 text-xs font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-stone-800">
            {comment.body}
          </p>
        )}
      </div>
    </div>
  )
}
