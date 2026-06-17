import type {
  CommentTreeNode,
  CommentThread,
} from '../utils/comment-tree.util'
import {
  buildCommentTree,
} from '../utils/comment-tree.util'
import { canDeleteThread } from '../utils/comment-permission.util'
import type { CommentInteractionHandlers } from './comment-component.type'
import { CommentItem } from './CommentItem'
import { CommentReplyInput } from './CommentReplyInput'

interface CommentThreadCardProps extends CommentInteractionHandlers {
  thread: CommentThread
  currentUserId?: string | null
  active?: boolean
  variant?: 'panel' | 'popover'
  editingCommentId?: string | null
  replyingToCommentId?: string | null
}

interface CommentBranchProps extends CommentThreadCardProps {
  node: CommentTreeNode
  depth: number
}

function CommentBranch({
  node,
  depth,
  thread,
  currentUserId,
  editingCommentId,
  replyingToCommentId,
  onSubmitReply,
  ...handlers
}: CommentBranchProps) {
  const comment = node.comment
  const editing = editingCommentId === comment._id
  const replying = replyingToCommentId === comment._id
  const isRoot = depth === 0

  return (
    <div className={depth > 0 ? 'relative pl-5' : ''}>
      {depth > 0 && (
        <div className="absolute left-1 top-0 h-full w-px bg-stone-200" />
      )}

      <CommentItem
        thread={thread}
        comment={comment}
        currentUserId={currentUserId}
        isRoot={isRoot}
        canDeleteWholeThread={canDeleteThread(thread, currentUserId)}
        editing={editing}
        onSubmitReply={onSubmitReply}
        {...handlers}
      />

      {replying && (
        <div className="mt-3 pl-9">
          <CommentReplyInput
            autoFocus
            onSubmit={(body) => onSubmitReply?.(comment, body, thread)}
          />
        </div>
      )}

      {node.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {node.replies.map((replyNode) => (
            <CommentBranch
              key={replyNode.comment._id}
              node={replyNode}
              depth={depth + 1}
              thread={thread}
              currentUserId={currentUserId}
              editingCommentId={editingCommentId}
              replyingToCommentId={replyingToCommentId}
              onSubmitReply={onSubmitReply}
              {...handlers}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentThreadCard({
  thread,
  currentUserId,
  active,
  variant = 'popover',
  editingCommentId,
  replyingToCommentId,
  ...handlers
}: CommentThreadCardProps) {
  const tree = buildCommentTree(thread.comments)

  return (
    <article
      className={`
        overflow-hidden rounded-xl border bg-white
        ${
          variant === 'popover'
            ? 'border-stone-200 shadow-xl'
            : active
              ? 'border-stone-300 bg-stone-50'
              : 'border-stone-200 shadow-sm'
        }
      `}
    >
      <div className="space-y-4 px-4 py-4">
        {tree.map((node) => (
          <CommentBranch
            key={node.comment._id}
            node={node}
            depth={0}
            thread={thread}
            currentUserId={currentUserId}
            editingCommentId={editingCommentId}
            replyingToCommentId={replyingToCommentId}
            {...handlers}
          />
        ))}

        {tree.length === 0 && (
          <p className="text-sm text-stone-400">No comments in this thread.</p>
        )}
      </div>
    </article>
  )
}