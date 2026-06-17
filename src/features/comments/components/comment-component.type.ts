import type { Comment, CommentThread } from '../utils/comment-tree.util'

export type FloatingThreadSource = 'anchor' | 'sidebar'

export interface CommentInteractionHandlers {
  onStartReply?: (comment: Comment, thread: CommentThread) => void
  onCancelReply?: () => void
  onSubmitReply?: (
    parentComment: Comment,
    body: string,
    thread: CommentThread,
  ) => void

  onStartEdit?: (comment: Comment, thread: CommentThread) => void
  onCancelEdit?: () => void
  onSaveEdit?: (
    comment: Comment,
    body: string,
    thread: CommentThread,
  ) => void

  onRequestDeleteComment?: (
    comment: Comment,
    thread: CommentThread,
  ) => void

  onRequestDeleteThread?: (thread: CommentThread) => void
}