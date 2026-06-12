export type DocumentSourceType = 'md_editor' | 'file_upload'

export type DocumentProcessingStatus =
  | 'processing'
  | 'processed'
  | 'failed'
  | 'unprocessable';

export type DocumentRole = 'owner' | 'editor' | 'commenter' | 'viewer';

export type DocumentPermission =
  | 'document:view'
  | 'document:edit'
  | 'document:delete'
  | 'document:rename'
  | 'document:manage_access'
  | 'document:comment'

export interface DocumentOwner {
  _id: string
  fullName: string
  avatarUrl?: string
}

export interface Document {
  _id: string
  workspaceId: string
  title: string
  sourceType: DocumentSourceType
  ownerId: string | DocumentOwner

  markdownContent?: string | null
  pdfFileUrl?: string
  pdfStorageKey?: string
  fileSize?: number

  extractedTextPreview?: string | null
  extractedTextCharCount: number
  extractedTextLimit: number
  isExtractedTextTruncated: boolean
  processingStatus: DocumentProcessingStatus

  permissions?: DocumentPermission[]

  createdAt: string
  updatedAt: string
}

export interface UploadPdfResponse extends Document {
  jobId: string;
}

export interface DocumentMember {
  _id: string
  documentId: string
  userId: {
    _id: string
    fullName: string
    email: string
    avatarUrl?: string
  }
  role: Exclude<DocumentRole, 'owner'>
  createdAt: string
  updatedAt: string
}

export interface CreateMarkdownDocumentPayload {
  title: string
  sourceType: 'md_editor'
  markdownContent: string
}

export interface UploadPdfDocumentPayload {
  file: File
  title?: string
  sourceType: 'file_upload'
}

export interface RenameDocumentPayload {
  title: string
}

export interface ShareDocumentPayload {
  userId: string
  role: Exclude<DocumentRole, 'owner'>
}

export type UploadJobStatus =
  | 'PENDING' | 'UPLOADING' | 'FILE_SAVED'
  | 'EXTRACTING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';