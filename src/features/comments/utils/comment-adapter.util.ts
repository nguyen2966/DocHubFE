import type {
  CommentAnnotation as DomainAnnotation,
  CommentUser,
  CommentUserRef,
  DocumentComment,
  RawCommentThread,
} from '../types/comment.type'
import type {
  Comment as UiComment,
  CommentAnnotation as UiAnnotation,
  CommentThread as UiThread,
} from './comment-tree.util'

type UnknownRecord = Record<string, unknown>

function toStringId(value: unknown): string {
  if (!value) return ''

  if (typeof value === 'string') return value

  if (typeof value === 'object') {
    const record = value as UnknownRecord

    if (typeof record._id === 'string') return record._id
    if (typeof record.id === 'string') return record.id

    if (typeof record.toString === 'function') {
      const stringified = record.toString()
      if (stringified && stringified !== '[object Object]') {
        return stringified
      }
    }
  }

  return String(value)
}

function normalizeUser(user: CommentUserRef | unknown): CommentUser {
  if (user && typeof user === 'object') {
    const record = user as Partial<CommentUser> & {
      id?: string
      name?: string
    }

    return {
      _id: record._id ?? record.id ?? toStringId(user),
      fullName: record.fullName ?? record.name ?? 'Unknown user',
      email: record.email,
      avatarUrl: record.avatarUrl ?? null,
    }
  }

  return {
    _id: typeof user === 'string' ? user : 'unknown-user',
    fullName: 'Unknown user',
    avatarUrl: null,
  }
}

function flattenComments(comments: DocumentComment[] = []): DocumentComment[] {
  const result: DocumentComment[] = []

  const walk = (comment: DocumentComment) => {
    const { replies, ...rest } = comment

    result.push({
      ...rest,
      _id: toStringId(rest._id),
      workspaceId: toStringId(rest.workspaceId),
      documentId: toStringId(rest.documentId),
      annotationId: toStringId(rest.annotationId),
      parentId: rest.parentId ? toStringId(rest.parentId) : null,
      authorId: rest.authorId,
    })

    for (const reply of replies ?? []) {
      walk(reply)
    }
  }

  for (const comment of comments) {
    walk(comment)
  }

  return result
}

export function toUiComment(comment: DocumentComment): UiComment {
  return {
    _id: toStringId(comment._id),
    annotationId: toStringId(comment.annotationId),
    parentId: comment.parentId ? toStringId(comment.parentId) : null,

    author: normalizeUser(comment.authorId),

    body: comment.status === 'deleted' ? '' : comment.content,

    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt ?? null,
    editedAt: comment.editedAt ?? null,

    deletedAt: comment.deletedAt ?? null,
    isDeleted: comment.status === 'deleted' || Boolean(comment.deletedAt),
  }
}

function toUiAnnotation(annotation: DomainAnnotation): UiAnnotation {
  return {
    _id: toStringId(annotation._id),
    pageNumber: annotation.pageNumber,
    position: annotation.position,
    xfdf: annotation.xfdf ?? null,
    apryseAnnotationId: annotation.apryseAnnotationId ?? null,
    visualState: annotation.visualState,
    status: annotation.status,
    threadStatus: annotation.threadStatus,
    excerpt: 'Document annotation',
    createdAt: annotation.createdAt,
  }
}

export function normalizeRawThread(raw: RawCommentThread): UiThread {
  const { comments, ...annotationFields } = raw

  const flatComments = flattenComments(comments ?? [])

  return {
    annotation: toUiAnnotation(annotationFields as DomainAnnotation),
    comments: flatComments.map(toUiComment),
  }
}

export function normalizeRawThreads(rawThreads: RawCommentThread[] = []) {
  return rawThreads.map(normalizeRawThread)
}
