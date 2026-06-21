import type {
  CommentTreeNode,
  CommentThread,
} from '../utils/comment-tree.util'
import type { ReactNode } from 'react'
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

interface CommentTreeRowProps {
  children: ReactNode
  isLast: boolean
}

function CommentTreeRow({ children, isLast }: CommentTreeRowProps) {
  return (
    <div className="relative">
      {isLast && (
        <span className="pointer-events-none absolute -left-8 top-5 bottom-[-0.75rem] z-10 w-1 bg-white" />
      )}

      <span className="pointer-events-none absolute -left-8 top-0 z-20 h-5 w-8 rounded-bl-2xl border-b-2 border-l-2 border-stone-200" />

      {children}
    </div>
  )
}

function CommentBranch({
  node,
  depth,
  thread,
  currentUserId,
  editingCommentId,
  replyingToCommentId,
  onSubmitReply,
  onCancelReply,
  ...handlers
}: CommentBranchProps) {
  const comment = node.comment
  const editing = editingCommentId === comment._id
  const replying = replyingToCommentId === comment._id
  const isRoot = depth === 0
  const hasChildRows = node.replies.length > 0 || replying

  return (
    <div className="relative">
      {hasChildRows && (
        <span className="pointer-events-none absolute left-[13px] top-8 bottom-0 w-0.5 bg-stone-200" />
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

      {hasChildRows && (
        <div className="relative ml-[13px] mt-3 space-y-3 pl-8">
          {node.replies.map((replyNode, index) => (
            <CommentTreeRow
              key={replyNode.comment._id}
              isLast={!replying && index === node.replies.length - 1}
            >
              <CommentBranch
                node={replyNode}
                depth={depth + 1}
                thread={thread}
                currentUserId={currentUserId}
                editingCommentId={editingCommentId}
                replyingToCommentId={replyingToCommentId}
                onSubmitReply={onSubmitReply}
                {...handlers}
              />
            </CommentTreeRow>
          ))}

          {replying && (
            <CommentTreeRow isLast>
              <div className="pl-9">
                <CommentReplyInput
                  autoFocus
                  onSubmit={(body) => onSubmitReply?.(comment, body, thread)}
                  onCancel={onCancelReply}
                />
              </div>
            </CommentTreeRow>
          )}
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
