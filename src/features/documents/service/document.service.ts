import api from '../../../shared/lib/axios';

import type {
  CreateMarkdownDocumentPayload,
  Document,
  DocumentMember,
  RenameDocumentPayload,
  ShareDocumentPayload,
} from '../types/document.type'

const basePath = (workspaceId: string) =>
  `/workspaces/${workspaceId}/documents`

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
  ): Promise<Document> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('sourceType', 'file_upload')

    if (title) {
      formData.append('title', title)
    }

    const res = await api.post<Document>(
      `${basePath(workspaceId)}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return res.data
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
}