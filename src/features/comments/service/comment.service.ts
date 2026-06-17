import api from '../../../shared/lib/axios';
import type {
  AnnotationActionVariables,
  CreateCommentReplyPayload,
  CreateCommentThreadPayload,
  DocumentComment,
  EditCommentPayload,
  RawCommentThread,
} from '../types/comment.type'

const basePath = (workspaceId: string, documentId: string) =>
  `/workspaces/${workspaceId}/documents/${documentId}`

export const commentService = {
  async getCommentThreads(
    workspaceId: string,
    documentId: string,
  ): Promise<RawCommentThread[]> {
    const res = await api.get<RawCommentThread[]>(
      `${basePath(workspaceId, documentId)}/comment-threads`,
    )

    return res.data
  },

  async createCommentThread(
    workspaceId: string,
    documentId: string,
    payload: CreateCommentThreadPayload,
  ): Promise<RawCommentThread> {
    const res = await api.post<RawCommentThread>(
      `${basePath(workspaceId, documentId)}/comment-threads`,
      payload,
    )

    return res.data
  },

  async createCommentReply(
    workspaceId: string,
    documentId: string,
    annotationId: string,
    payload: CreateCommentReplyPayload,
  ): Promise<DocumentComment> {
    const res = await api.post<DocumentComment>(
      `${basePath(workspaceId, documentId)}/annotations/${annotationId}/comments`,
      payload,
    )

    return res.data
  },

  async editComment(
    workspaceId: string,
    documentId: string,
    commentId: string,
    payload: EditCommentPayload,
  ): Promise<DocumentComment> {
    const res = await api.patch<DocumentComment>(
      `${basePath(workspaceId, documentId)}/comments/${commentId}`,
      payload,
    )

    return res.data
  },

  async deleteComment(
    workspaceId: string,
    documentId: string,
    commentId: string,
  ): Promise<{ deleted: boolean }> {
    const res = await api.delete<{ deleted: boolean }>(
      `${basePath(workspaceId, documentId)}/comments/${commentId}`,
    )

    return res.data
  },

  async deleteThread(
    workspaceId: string,
    documentId: string,
    annotationId: string,
  ): Promise<{ deleted: boolean }> {
    const res = await api.delete<{ deleted: boolean }>(
      `${basePath(workspaceId, documentId)}/annotations/${annotationId}`,
    )

    return res.data
  },
}