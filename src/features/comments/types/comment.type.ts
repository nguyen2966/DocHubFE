export type AnnotationVisualState = 'highlight' | 'point'
export type AnnotationStatus = 'active' | 'deleted'
export type ThreadStatus = 'open' | 'resolved'
export type CommentStatus = 'active' | 'deleted'

export interface CommentPosition {
  x: number
  y: number
}

export interface EditedRect {
  pageNumber: number
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface CommentUser {
  _id: string
  fullName: string
  email?: string
  avatarUrl?: string | null
}

export type CommentUserRef = string | CommentUser

export interface CommentAnnotation {
  _id: string
  workspaceId: string
  documentId: string
  createdBy: CommentUserRef

  pageNumber: number
  position: CommentPosition

  xfdf: string | null
  apryseAnnotationId: string | null

  kind: 'comment_anchor'
  visualState: AnnotationVisualState

  status: AnnotationStatus
  threadStatus: ThreadStatus

  resolvedBy?: CommentUserRef | null
  resolvedAt?: string | null

  deletedBy?: CommentUserRef | null
  deletedAt?: string | null

  createdAt: string
  updatedAt: string
}

export interface DocumentComment {
  _id: string
  workspaceId: string
  documentId: string
  annotationId: string

  authorId: CommentUserRef
  parentId: string | null

  content: string
  status: CommentStatus

  isEdited: boolean
  editedAt: string | null

  deletedBy?: CommentUserRef | null
  deletedAt?: string | null

  createdAt: string
  updatedAt: string

  /**
   * BE may return nested replies from buildNestedComments().
   * FE adapter will flatten this into UI comments.
   */
  replies?: DocumentComment[]
}

/**
 * Ideal normalized domain thread.
 */
export interface CommentThread {
  annotation: CommentAnnotation
  comments: DocumentComment[]
}

/**
 * Actual BE getThreads/createThread response currently:
 * annotation fields are spread at root level, with comments attached.
 */
export type RawCommentThread = CommentAnnotation & {
  comments: DocumentComment[]
}

export interface PendingCommentAnchor {
  pageNumber: number
  position: CommentPosition

  xfdf?: string | null
  apryseAnnotationId?: string | null

  visualState: AnnotationVisualState

  /**
   * Local-only id for temporary Apryse highlight/marker before BE create succeeds.
   */
  temporaryAnchorId?: string
}

export interface CreateCommentThreadPayload {
  pageNumber: number
  position: CommentPosition

  xfdf?: string | null
  apryseAnnotationId?: string | null

  content: string
}

export interface CreateCommentReplyPayload {
  content: string
  parentId?: string | null
}

export interface EditCommentPayload {
  content: string
}

export interface CreateCommentThreadVariables {
  workspaceId: string
  documentId: string
  payload: CreateCommentThreadPayload
}

export interface CreateCommentReplyVariables {
  workspaceId: string
  documentId: string
  annotationId: string
  payload: CreateCommentReplyPayload
}

export interface EditCommentVariables {
  workspaceId: string
  documentId: string
  commentId: string
  payload: EditCommentPayload
}

export interface DeleteCommentVariables {
  workspaceId: string
  documentId: string
  commentId: string
}

export interface AnnotationActionVariables {
  workspaceId: string
  documentId: string
  annotationId: string
}