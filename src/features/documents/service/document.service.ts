import api from '../../../shared/lib/axios';
import type { AxiosProgressEvent } from 'axios';
import type {
  SharedDocument,
  SharedDocumentDetail,
} from '../types/document.type'

import type {
  CreateMarkdownDocumentPayload,
  Document,
  DocumentMember,
  RenameDocumentPayload,
  ShareDocumentPayload,
  UploadPdfResponse,
  DocumentAccessSummary,
  SearchDocumentUserResult,
  ShareDocumentAccessPayload,
  ShareDocumentAccessResponse,
  ShareRole,
} from '../types/document.type'
import type { EditedRect } from '../../comments/types/comment.type'


const basePath = (workspaceId: string) =>
  `/workspaces/${workspaceId}/documents`;

const documentPath = (workspaceId: string, documentId: string) =>
  `/workspaces/${workspaceId}/documents/${documentId}`

export const documentService = {
  async getDocuments(workspaceId: string): Promise<Document[]> {
    const res = await api.get<Document[]>(basePath(workspaceId))
    return res.data
  },

  async getDocumentDetail(
    workspaceId: string,
    documentId: string,
  ): Promise<Document> {
    const res = await api.get<Document>(
      `${basePath(workspaceId)}/${documentId}`,
    )
    return res.data
  },

  async createMarkdownDocument(
    workspaceId: string,
    payload: CreateMarkdownDocumentPayload,
  ): Promise<Document> {
    const res = await api.post<Document>(basePath(workspaceId), payload)
    return res.data
  },

  async uploadPdfDocument(
    workspaceId: string,
    file: File,
    title?: string,
    jobId?: string,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
    signal?: AbortSignal
  ): Promise<UploadPdfResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceType', 'file_upload');
    if (jobId) formData.append('jobId', jobId);

    if (title?.trim()) {
      formData.append('title', title.trim())
    }

    const res = await api.post<UploadPdfResponse>(
      `${basePath(workspaceId)}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
        signal
      },
    )

    return res.data
  },

  async cancelUpload(workspaceId: string, jobId: string): Promise<void> {
    await api.delete(`${basePath(workspaceId)}/upload/${jobId}/cancel`)
  },

  async renameDocument(
    workspaceId: string,
    documentId: string,
    payload: RenameDocumentPayload,
  ): Promise<Document> {
    const res = await api.patch<Document>(
      `${basePath(workspaceId)}/${documentId}/rename`,
      payload,
    )
    return res.data
  },

  async deleteDocument(
    workspaceId: string,
    documentId: string,
  ): Promise<void> {
    await api.delete(`${basePath(workspaceId)}/${documentId}`)
  },

  async getDocumentMembers(
    workspaceId: string,
    documentId: string,
  ): Promise<DocumentMember[]> {
    const res = await api.get<DocumentMember[]>(
      `${basePath(workspaceId)}/${documentId}/members`,
    )
    return res.data
  },

  async shareDocument(
    workspaceId: string,
    documentId: string,
    payload: ShareDocumentPayload,
  ): Promise<DocumentMember> {
    const res = await api.post<DocumentMember>(
      `${basePath(workspaceId)}/${documentId}/members`,
      payload,
    )
    return res.data
  },

  async removeDocumentAccess(
    workspaceId: string,
    documentId: string,
    userId: string,
  ): Promise<void> {
    await api.delete(`${basePath(workspaceId)}/${documentId}/members/${userId}`)
  },

  async editPdf(
    workspaceId: string,
    documentId: string,
    file: Blob,
    editedRects: EditedRect[] = [],
    degradedAnnotationIds: string[] = [],
  ): Promise<Document> {
    const formData = new FormData()
    formData.append('file', file, 'edited.pdf')

    if (editedRects.length > 0) {
      formData.append('editedRects', JSON.stringify(editedRects))
    }

    if (degradedAnnotationIds.length > 0) {
      formData.append(
        'degradedAnnotationIds',
        JSON.stringify(degradedAnnotationIds),
      )
    }

    const response = await api.patch<Document>(
      `${basePath(workspaceId)}/${documentId}/content`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response.data
  },

  async createUploadJob(workspaceId: string): Promise<{ jobId: string }> {
    const res = await api.post<{ jobId: string }>(
      `${basePath(workspaceId)}/upload-jobs`,
    )
    return res.data
  },

  async getSharedWithMeDocuments(): Promise<SharedDocument[]> {
    const res = await api.get<SharedDocument[]>('/shared-with-me/documents')
    return res.data
  },

  async getSharedWithMeDocumentDetail(
    documentId: string,
  ): Promise<SharedDocumentDetail> {
    const res = await api.get<SharedDocumentDetail>(
      `/shared-with-me/documents/${documentId}`,
    )
    return res.data
  },


  async getDocumentAccess(
    workspaceId: string,
    documentId: string,
  ): Promise<DocumentAccessSummary> {
    const res = await api.get<DocumentAccessSummary>(
      `${documentPath(workspaceId, documentId)}/access`,
    )
    return res.data
  },

  async searchDocumentUsers(
    workspaceId: string,
    documentId: string,
    email: string,
  ): Promise<{ results: SearchDocumentUserResult[] }> {
    const res = await api.get<{ results: SearchDocumentUserResult[] }>(
      `${documentPath(workspaceId, documentId)}/users/search`,
      { params: { email } },
    )
    return res.data
  },

  async shareDocumentAccess(
    workspaceId: string,
    documentId: string,
    payload: ShareDocumentAccessPayload,
  ): Promise<ShareDocumentAccessResponse> {
    const res = await api.post<ShareDocumentAccessResponse>(
      `${documentPath(workspaceId, documentId)}/members`,
      payload,
    )
    return res.data
  },

  async updateDocumentUserRole(
    workspaceId: string,
    documentId: string,
    userId: string,
    role: ShareRole,
  ) {
    const res = await api.patch(
      `${documentPath(workspaceId, documentId)}/members/${userId}`,
      { role },
    )
    return res.data
  },

  async updatePendingDocumentShareRole(
    workspaceId: string,
    documentId: string,
    shareId: string,
    role: ShareRole,
  ) {
    const res = await api.patch(
      `${documentPath(workspaceId, documentId)}/pending-shares/${shareId}`,
      { role },
    )
    return res.data
  },

  async removePendingDocumentShare(
    workspaceId: string,
    documentId: string,
    shareId: string,
  ) {
    const res = await api.delete(
      `${documentPath(workspaceId, documentId)}/pending-shares/${shareId}`,
    )
    return res.data
  },
}
