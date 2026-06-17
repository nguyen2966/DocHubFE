export interface CommentAuthor {
  _id: string
  fullName: string
  email?: string
  avatarUrl?: string | null
}

export interface CommentAnnotation {
  _id: string
  pageNumber?: number
  position?: {
    x: number
    y: number
  }
  xfdf?: string | null
  apryseAnnotationId?: string | null
  visualState?: 'highlight' | 'point'
  status?: 'active' | 'deleted'
  threadStatus?: 'open' | 'resolved'
  excerpt?: string
  createdAt?: string
}

export interface Comment {
  _id: string
  annotationId?: string
  parentId: string | null

  author: CommentAuthor

  body: string

  createdAt: string
  updatedAt?: string | null
  editedAt?: string | null

  deletedAt?: string | null
  isDeleted?: boolean
}

export interface CommentThread {
  annotation: CommentAnnotation
  comments: Comment[]
}

export interface CommentTreeNode {
  comment: Comment
  replies: CommentTreeNode[]
}

const getCommentTime = (comment?: Comment | null) =>
  comment ? new Date(comment.createdAt).getTime() || 0 : 0

export function getRootComment(comments: Comment[]) {
  return comments.find((comment) => comment.parentId === null) ?? null
}

export function getCommentReplies(comments: Comment[], parentId: string) {
  return comments
    .filter((comment) => comment.parentId === parentId)
    .sort((a, b) => getCommentTime(a) - getCommentTime(b))
}

export function buildCommentTree(comments: Comment[]) {
  const childrenByParentId = new Map<string, Comment[]>()

  for (const comment of comments) {
    if (comment.parentId === null) continue

    const siblings = childrenByParentId.get(comment.parentId) ?? []
    siblings.push(comment)
    childrenByParentId.set(comment.parentId, siblings)
  }

  for (const siblings of childrenByParentId.values()) {
    siblings.sort((a, b) => getCommentTime(a) - getCommentTime(b))
  }

  const buildNode = (comment: Comment): CommentTreeNode => ({
    comment,
    replies: (childrenByParentId.get(comment._id) ?? []).map(buildNode),
  })

  return comments
    .filter((comment) => comment.parentId === null)
    .sort((a, b) => getCommentTime(b) - getCommentTime(a))
    .map(buildNode)
}

export function sortThreadsByNewestRoot(threads: CommentThread[]) {
  return [...threads].sort((a, b) => {
    const aRoot = getRootComment(a.comments)
    const bRoot = getRootComment(b.comments)

    const aTime =
      getCommentTime(aRoot) ||
      new Date(a.annotation.createdAt ?? '').getTime() ||
      0

    const bTime =
      getCommentTime(bRoot) ||
      new Date(b.annotation.createdAt ?? '').getTime() ||
      0

    return bTime - aTime
  })
}

export function countVisibleComments(comments: Comment[]) {
  return comments.length
}

export function isCommentDeleted(comment: Comment) {
  return Boolean(comment.isDeleted || comment.deletedAt)
}

export function isCommentEdited(comment: Comment) {
  if (comment.editedAt) return true
  if (!comment.updatedAt) return false

  return (
    new Date(comment.updatedAt).getTime() >
    new Date(comment.createdAt).getTime()
  )
}
