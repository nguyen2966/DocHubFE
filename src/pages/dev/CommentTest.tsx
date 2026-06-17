import { ChatCircleText, X } from '@phosphor-icons/react';
import { useMemo, useRef, useState } from 'react';

import { CommentThreadPopover } from '../../features/comments/components/CommentThreadPopover';
import { CommentPanel } from '../../features/comments/components/CommentPanel';
import { DeleteCommentConfirmModal } from '../../features/comments/components/DeleteCommentConfirmModal';
import { DeleteThreadConfirmModal } from '../../features/comments/components/DeleteThreadConfirmModal';

import type {
  Comment,
  CommentThread,
} from '../../features/comments/utils/comment-tree.util'

type FloatingThreadSource = 'anchor' | 'sidebar'

type PendingDelete =
  | {
      type: 'comment'
      comment: Comment
      thread: CommentThread
    }
  | {
      type: 'thread'
      thread: CommentThread
    }
  | null

const CURRENT_USER_ID = 'user-james'

const MOCK_THREADS: CommentThread[] = [
  {
    annotation: {
      _id: 'annotation-budget',
      pageNumber: 1,
      excerpt: 'Great point about the budget!',
      createdAt: '2026-05-04T10:30:05.000Z',
    },
    comments: [
      {
        _id: 'comment-budget-root',
        annotationId: 'annotation-budget',
        parentId: null,
        author: {
          _id: 'user-james',
          fullName: 'James Lee',
          avatarUrl: null,
        },
        body: 'Great point about the budget!',
        createdAt: '2026-05-04T10:30:05.000Z',
        updatedAt: '2026-05-04T10:30:05.000Z',
      },
      {
        _id: 'comment-budget-reply-1',
        annotationId: 'annotation-budget',
        parentId: 'comment-budget-root',
        author: {
          _id: 'user-sarah',
          fullName: 'Sarah Johnson',
          avatarUrl: null,
        },
        body: 'Can we revisit this in next sprint?',
        createdAt: '2026-05-04T11:00:12.000Z',
        updatedAt: '2026-05-04T11:00:12.000Z',
      },
      {
        _id: 'comment-budget-reply-2',
        annotationId: 'annotation-budget',
        parentId: 'comment-budget-root',
        author: {
          _id: 'user-james',
          fullName: 'James Lee',
          avatarUrl: null,
        },
        body: '',
        createdAt: '2026-05-04T11:15:00.000Z',
        updatedAt: '2026-05-04T11:20:00.000Z',
        deletedAt: '2026-05-04T11:20:00.000Z',
        isDeleted: true,
      },
    ],
  },
  {
    annotation: {
      _id: 'annotation-design',
      pageNumber: 1,
      excerpt: 'Feedback on design',
      createdAt: '2026-05-03T08:20:00.000Z',
    },
    comments: [
      {
        _id: 'comment-design-root',
        annotationId: 'annotation-design',
        parentId: null,
        author: {
          _id: 'user-sarah',
          fullName: 'Sarah Johnson',
          avatarUrl: null,
        },
        body: 'Feedback on design Feedback on design Feedback on design',
        createdAt: '2026-05-03T08:20:00.000Z',
        updatedAt: '2026-05-03T08:20:00.000Z',
      },
      {
        _id: 'comment-design-reply-1',
        annotationId: 'annotation-design',
        parentId: 'comment-design-root',
        author: {
          _id: 'user-james',
          fullName: 'James Lee',
          avatarUrl: null,
        },
        body: 'Looking good — minor spacing nit on the header.',
        createdAt: '2026-05-03T09:10:00.000Z',
        updatedAt: '2026-05-03T10:30:00.000Z',
        editedAt: '2026-05-03T10:30:00.000Z',
      },
    ],
  },
  {
    annotation: {
      _id: 'annotation-direction',
      pageNumber: 1,
      excerpt: 'Great work team!',
      createdAt: '2026-05-02T13:10:00.000Z',
    },
    comments: [
      {
        _id: 'comment-direction-root',
        annotationId: 'annotation-direction',
        parentId: null,
        author: {
          _id: 'user-emily',
          fullName: 'Emily Chen',
          avatarUrl: null,
        },
        body: 'Great work team! Love the direction.',
        createdAt: '2026-05-02T13:10:00.000Z',
        updatedAt: '2026-05-02T13:10:00.000Z',
      },
      {
        _id: 'comment-direction-reply-1',
        annotationId: 'annotation-direction',
        parentId: 'comment-direction-root',
        author: {
          _id: 'user-david',
          fullName: 'David Patel',
          avatarUrl: null,
        },
        body: 'Can we discuss the color palette?',
        createdAt: '2026-05-02T14:10:00.000Z',
        updatedAt: '2026-05-02T14:10:00.000Z',
      },
    ],
  },
]

const ANCHOR_POSITIONS: Record<string, { x: number; y: number }> = {
  'annotation-budget': { x: 324, y: 268 },
  'annotation-design': { x: 522, y: 270 },
  'annotation-direction': { x: 438, y: 318 },
}

function getViewerLeftPopoverPosition(viewerElement: HTMLDivElement | null) {
  if (!viewerElement) {
    return { x: 24, y: 200 }
  }

  const rect = viewerElement.getBoundingClientRect()

  return {
    x: rect.left + 18,
    y: rect.top + 152,
  }
}

function getAnchorPopoverPosition(
  viewerElement: HTMLDivElement | null,
  anchorPosition: { x: number; y: number },
) {
  if (!viewerElement) {
    return {
      x: anchorPosition.x + 32,
      y: anchorPosition.y - 16,
    }
  }

  const rect = viewerElement.getBoundingClientRect()

  return {
    x: rect.left + anchorPosition.x + 32,
    y: rect.top + anchorPosition.y - 20,
  }
}

function makeReply(parent: Comment, body: string): Comment {
  return {
    _id: `comment-${crypto.randomUUID()}`,
    annotationId: parent.annotationId,
    parentId: parent._id,
    author: {
      _id: CURRENT_USER_ID,
      fullName: 'James Lee',
      avatarUrl: null,
    },
    body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function updateThreadComment(
  thread: CommentThread,
  commentId: string,
  updater: (comment: Comment) => Comment,
): CommentThread {
  return {
    ...thread,
    comments: thread.comments.map((comment) =>
      comment._id === commentId ? updater(comment) : comment,
    ),
  }
}

export function CommentUiTestPage() {
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const anchorRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const [threads, setThreads] = useState<CommentThread[]>(MOCK_THREADS)

  const [commentsOpen, setCommentsOpen] = useState(false)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)

  const [floatingThreadId, setFloatingThreadId] = useState<string | null>(null)
  const [floatingThreadPosition, setFloatingThreadPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [floatingThreadSource, setFloatingThreadSource] =
    useState<FloatingThreadSource | null>(null)

  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(
    null,
  )
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null)

  const floatingThread = useMemo(
    () =>
      threads.find((thread) => thread.annotation._id === floatingThreadId) ??
      null,
    [floatingThreadId, threads],
  )

  const openCommentsSidebar = () => {
    setCommentsOpen(true)

    // Opening sidebar closes all current thread popups.
    setFloatingThreadId(null)
    setFloatingThreadPosition(null)
    setFloatingThreadSource(null)
    setReplyingToCommentId(null)
    setEditingCommentId(null)
  }

  const closeCommentsSidebar = () => {
    setCommentsOpen(false)

    if (floatingThreadSource === 'sidebar') {
      setFloatingThreadId(null)
      setFloatingThreadPosition(null)
      setFloatingThreadSource(null)
    }
  }

  const closeThreadPopover = () => {
    setFloatingThreadId(null)
    setFloatingThreadPosition(null)
    setFloatingThreadSource(null)
    setReplyingToCommentId(null)
    setEditingCommentId(null)
  }

  const scrollToFakeAnchor = (threadId: string) => {
    const anchor = anchorRefs.current[threadId]
    anchor?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }

  const handleDocumentAnchorClick = (
    threadId: string,
    anchorPosition: { x: number; y: number },
  ) => {
    setSelectedThreadId(threadId)

    if (commentsOpen) {
      return
    }

    setFloatingThreadId(threadId)
    setFloatingThreadSource('anchor')
    setFloatingThreadPosition(
      getAnchorPopoverPosition(viewerRef.current, anchorPosition),
    )
  }

  const handleSidebarThreadClick = (thread: CommentThread) => {
    const threadId = thread.annotation._id

    setSelectedThreadId(threadId)
    scrollToFakeAnchor(threadId)

    setFloatingThreadId(threadId)
    setFloatingThreadSource('sidebar')
    setFloatingThreadPosition(getViewerLeftPopoverPosition(viewerRef.current))
    setReplyingToCommentId(null)
    setEditingCommentId(null)
  }

  const handleSubmitReply = (
    parentComment: Comment,
    body: string,
    thread: CommentThread,
  ) => {
    const reply = makeReply(parentComment, body)

    setThreads((currentThreads) =>
      currentThreads.map((item) =>
        item.annotation._id === thread.annotation._id
          ? {
              ...item,
              comments: [...item.comments, reply],
            }
          : item,
      ),
    )

    setReplyingToCommentId(null)
  }

  const handleSaveEdit = (
    comment: Comment,
    body: string,
    thread: CommentThread,
  ) => {
    const now = new Date().toISOString()

    setThreads((currentThreads) =>
      currentThreads.map((item) =>
        item.annotation._id === thread.annotation._id
          ? updateThreadComment(item, comment._id, (target) => ({
              ...target,
              body,
              updatedAt: now,
              editedAt: now,
            }))
          : item,
      ),
    )

    setEditingCommentId(null)
  }

  const confirmDeleteComment = (comment: Comment, thread: CommentThread) => {
    setPendingDelete({
      type: 'comment',
      comment,
      thread,
    })
  }

  const confirmDeleteThread = (thread: CommentThread) => {
    setPendingDelete({
      type: 'thread',
      thread,
    })
  }

  const handleConfirmDelete = () => {
    if (!pendingDelete) return

    if (pendingDelete.type === 'thread') {
      const deletedThreadId = pendingDelete.thread.annotation._id

      setThreads((currentThreads) =>
        currentThreads.filter(
          (thread) => thread.annotation._id !== deletedThreadId,
        ),
      )

      if (selectedThreadId === deletedThreadId) {
        setSelectedThreadId(null)
      }

      if (floatingThreadId === deletedThreadId) {
        closeThreadPopover()
      }

      setPendingDelete(null)
      return
    }

    const { comment, thread } = pendingDelete
    const now = new Date().toISOString()

    setThreads((currentThreads) =>
      currentThreads.map((item) =>
        item.annotation._id === thread.annotation._id
          ? updateThreadComment(item, comment._id, (target) => ({
              ...target,
              body: '',
              isDeleted: true,
              deletedAt: now,
              updatedAt: now,
            }))
          : item,
      ),
    )

    setPendingDelete(null)
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <div
        className={`
          flex min-h-screen flex-col transition-[padding] duration-200
          ${commentsOpen ? 'pr-[300px]' : 'pr-0'}
        `}
      >
        <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <button className="text-sm text-stone-500 hover:text-stone-900">
              ← Back to Documents
            </button>

            <div className="h-5 w-px bg-stone-200" />

            <h1 className="text-sm font-semibold text-stone-950">
              Quarterly Report
            </h1>

            <span className="rounded-full border border-stone-200 px-2 py-0.5 text-[11px] text-stone-500">
              Owner
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50">
              Edit PDF
            </button>

            <button
              type="button"
              onClick={openCommentsSidebar}
              className={`
                inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition
                ${
                  commentsOpen
                    ? 'border-stone-950 bg-stone-950 text-white'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }
              `}
            >
              <ChatCircleText size={16} />
              Comments
            </button>

            <button className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50">
              Share
            </button>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 overflow-hidden">
          <section
            ref={viewerRef}
            className="relative flex-1 overflow-auto bg-stone-100"
          >
            <div className="mx-auto my-8 flex w-[900px] justify-center">
              <div className="relative min-h-[980px] w-[490px] bg-white px-12 py-10 shadow-sm">
                <h2 className="font-serif text-3xl text-black">Sample PDF</h2>

                <h3 className="mt-2 font-serif text-2xl text-black">
                  This is a simple PDF file. Fun fun fun.
                </h3>

                <p className="mt-4 font-serif text-[13px] leading-[1.42] text-black">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  Phasellus facilisis odio sed mi. Curabitur suscipit. Nullam
                  vel nisi. Etiam semper ipsum ut lectus. Proin aliquam, erat
                  eget pharetra commodo, eros mi condimentum quam, sed commodo
                  justo quam ut velit. Integer a erat. Cras laoreet ligula
                  cursus enim. Aenean scelerisque velit et tellus.
                </p>

                <p className="mt-2 font-serif text-[13px] leading-[1.42] text-black">
                  Vestibulum dictum aliquet sem. Nulla facilisi. Vestibulum
                  accumsan ante vitae elit. Nulla erat dolor, blandit in, rutrum
                  quis, semper pulvinar, enim. Nullam varius congue risus.
                  Vivamus sollicitudin, metus ut interdum eleifend, nisi tellus
                  pellentesque elit, tristique
                  <span className="relative mx-0.5 rounded-sm bg-yellow-200 px-0.5">
                    accumsan eros quam et risus. Suspendisse libero odio,
                    mattis sit amet, aliquet eget,
                  </span>
                  hendrerit vel, nulla. Sed vitae augue. Aliquam erat volutpat.
                  Aliquam feugiat vulputate nisl. Suspendisse quis nulla pretium
                  ante pretium mollis.
                </p>

                <p className="mt-2 font-serif text-[13px] leading-[1.42] text-black">
                  Proin velit ligula, sagittis at, egestas a, pulvinar quis,
                  nisl. Pellentesque sit amet lectus. Praesent pulvinar, nunc
                  quis iaculis sagittis, justo quam lobortis tortor, sed
                  vestibulum dui metus venenatis est. Nunc cursus ligula. Nulla
                  facilisi. Phasellus ullamcorper consectetuer ante.
                </p>

                <button
                  ref={(element) => {
                    anchorRefs.current['annotation-budget'] = element
                  }}
                  type="button"
                  onClick={() =>
                    handleDocumentAnchorClick(
                      'annotation-budget',
                      ANCHOR_POSITIONS['annotation-budget'],
                    )
                  }
                  className={`
                    absolute flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-fuchsia-500 text-[10px] font-semibold text-white shadow-lg ring-2 transition
                    ${
                      selectedThreadId === 'annotation-budget'
                        ? 'ring-fuchsia-500'
                        : 'ring-transparent hover:ring-fuchsia-300'
                    }
                  `}
                  style={{
                    left: ANCHOR_POSITIONS['annotation-budget'].x,
                    top: ANCHOR_POSITIONS['annotation-budget'].y,
                  }}
                >
                  J
                </button>

                <button
                  ref={(element) => {
                    anchorRefs.current['annotation-design'] = element
                  }}
                  type="button"
                  onClick={() =>
                    handleDocumentAnchorClick(
                      'annotation-design',
                      ANCHOR_POSITIONS['annotation-design'],
                    )
                  }
                  className={`
                    absolute flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-violet-500 text-[10px] font-semibold text-white shadow-lg ring-2 transition
                    ${
                      selectedThreadId === 'annotation-design'
                        ? 'ring-violet-500'
                        : 'ring-transparent hover:ring-violet-300'
                    }
                  `}
                  style={{
                    left: ANCHOR_POSITIONS['annotation-design'].x,
                    top: ANCHOR_POSITIONS['annotation-design'].y,
                  }}
                >
                  S
                </button>

                <button
                  ref={(element) => {
                    anchorRefs.current['annotation-direction'] = element
                  }}
                  type="button"
                  onClick={() =>
                    handleDocumentAnchorClick(
                      'annotation-direction',
                      ANCHOR_POSITIONS['annotation-direction'],
                    )
                  }
                  className={`
                    absolute flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-pink-500 text-[10px] font-semibold text-white shadow-lg ring-2 transition
                    ${
                      selectedThreadId === 'annotation-direction'
                        ? 'ring-pink-500'
                        : 'ring-transparent hover:ring-pink-300'
                    }
                  `}
                  style={{
                    left: ANCHOR_POSITIONS['annotation-direction'].x,
                    top: ANCHOR_POSITIONS['annotation-direction'].y,
                  }}
                >
                  E
                </button>
              </div>
            </div>

            <div className="sticky bottom-0 flex h-12 items-center justify-center gap-4 border-t border-stone-200 bg-white/95 text-sm text-stone-500 backdrop-blur">
              <button className="rounded-md px-2 py-1 hover:bg-stone-100">
                ‹‹
              </button>
              <button className="rounded-md px-2 py-1 hover:bg-stone-100">
                ‹
              </button>
              <span className="rounded-lg border border-stone-200 px-3 py-1">
                1
              </span>
              <span>/17</span>
              <button className="rounded-md px-2 py-1 hover:bg-stone-100">
                ›
              </button>
              <button className="rounded-md px-2 py-1 hover:bg-stone-100">
                ››
              </button>
            </div>

            <CommentThreadPopover
              open={Boolean(floatingThread)}
              thread={floatingThread}
              position={floatingThreadPosition}
              source={floatingThreadSource}
              currentUserId={CURRENT_USER_ID}
              editingCommentId={editingCommentId}
              replyingToCommentId={replyingToCommentId}
              onClose={closeThreadPopover}
              onStartReply={(comment) => {
                setEditingCommentId(null)
                setReplyingToCommentId(comment._id)
              }}
              onCancelReply={() => setReplyingToCommentId(null)}
              onSubmitReply={handleSubmitReply}
              onStartEdit={(comment) => {
                setReplyingToCommentId(null)
                setEditingCommentId(comment._id)
              }}
              onCancelEdit={() => setEditingCommentId(null)}
              onSaveEdit={handleSaveEdit}
              onRequestDeleteComment={confirmDeleteComment}
              onRequestDeleteThread={confirmDeleteThread}
            />
          </section>
        </main>
      </div>

      <CommentPanel
        open={commentsOpen}
        threads={threads}
        activeAnnotationId={selectedThreadId}
        onClose={closeCommentsSidebar}
        onSelectThread={handleSidebarThreadClick}
      />

      <DeleteCommentConfirmModal
        open={pendingDelete?.type === 'comment'}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <DeleteThreadConfirmModal
        open={pendingDelete?.type === 'thread'}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {commentsOpen && (
        <button
          type="button"
          onClick={closeCommentsSidebar}
          className="fixed right-[312px] top-4 z-50 rounded-full border border-stone-200 bg-white p-1.5 text-stone-500 shadow-sm hover:bg-stone-50 hover:text-stone-900"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}