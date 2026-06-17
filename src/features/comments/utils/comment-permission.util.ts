import type { Comment, CommentThread } from './comment-tree.util'
import { getRootComment, isCommentDeleted } from './comment-tree.util'

function getAuthorId(comment: Comment | null | undefined) {
  return comment?.author?._id ?? null
}

export function isOwnComment(
  comment: Comment | null | undefined,
  currentUserId: string | null | undefined,
) {
  if (!comment || !currentUserId) return false

  return getAuthorId(comment) === currentUserId
}

export function canEditComment(
  comment: Comment | null | undefined,
  currentUserId: string | null | undefined,
) {
  if (!comment) return false
  if (isCommentDeleted(comment)) return false

  return isOwnComment(comment, currentUserId)
}

export function canDeleteComment(
  comment: Comment | null | undefined,
  currentUserId: string | null | undefined,
) {
  if (!comment) return false
  if (isCommentDeleted(comment)) return false

  return isOwnComment(comment, currentUserId)
}

export function canReplyToComment(
  comment: Comment | null | undefined,
  canComment = true,
) {
  if (!comment) return false
  if (isCommentDeleted(comment)) return false

  return canComment
}

export function canDeleteThread(
  thread: CommentThread | null | undefined,
  currentUserId: string | null | undefined,
) {
  if (!thread || !currentUserId) return false

  const rootComment = getRootComment(thread.comments)

  if (!rootComment) return false
  if (isCommentDeleted(rootComment)) return false

  return isOwnComment(rootComment, currentUserId)
}