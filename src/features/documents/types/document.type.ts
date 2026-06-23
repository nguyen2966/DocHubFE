import type { PagePaginatedResponse } from '../../../shared/types/pagination.type'

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

export type DocumentListResponse = PagePaginatedResponse<Document>

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


  export interface SharedDocument {
  _id: string
  workspaceId: string
  workspaceName: string
  title: string
  sourceType: DocumentSourceType
  processingStatus: DocumentProcessingStatus
  pdfFileUrl?: string
  role: Exclude<DocumentRole, 'owner'>
  permissions?: DocumentPermission[]
  owner: {
    _id: string
    fullName: string
    email: string
    avatarUrl?: string | null
  } | null
  sharedAt: string | null
  updatedAt: string | null
  createdAt: string | null
}

export type SharedDocumentListResponse =
  PagePaginatedResponse<SharedDocument>

export interface SharedDocumentDetail extends Document {
  workspaceName: string
  role: Exclude<DocumentRole, 'owner'>
  sharedAt: string | null
}

export type ShareRole = 'viewer' | 'commenter' | 'editor'

export interface DocumentExternalUser {
  userId: string
  fullName: string
  email: string
  avatarUrl?: string | null
  role: ShareRole
  permissionId: string
  createdAt: string
}

export interface PendingDocumentUser {
  shareId: string
  email: string
  role: ShareRole
  createdAt: string
}

export interface DocumentAccessSummary {
  workspace: {
    workspaceId: string
    workspaceName: string
    memberCount: number
  }
  owner: {
    userId: string
    fullName: string
    email: string
    avatarUrl?: string | null
    role: 'owner'
  } | null
  externalUsers: DocumentExternalUser[]
  pendingUsers: PendingDocumentUser[]
}

export interface SearchDocumentUserResult {
  userId?: string
  email: string
  fullName?: string
  avatarUrl?: string | null
  isRegistered: boolean
  isWorkspaceMember: boolean
  isOwner: boolean
  explicitDocumentRole: ShareRole | null
  effectiveDocumentRole: ShareRole | 'owner' | null
  canBeShared: boolean
  disabledReason:
    | 'OWNER'
    | 'WORKSPACE_MEMBER'
    | 'ALREADY_HAS_DOCUMENT_PERMISSION'
    | null
}

export interface ShareDocumentAccessPayload {
  emails: string[]
  role: ShareRole
}

export interface ShareDocumentAccessResponse {
  granted: Array<{
    userId: string
    email: string
    role: ShareRole
  }>
  pending: Array<{
    shareId: string
    email: string
    role: ShareRole
    shareLink?: string
  }>
  skipped: Array<{
    email: string
    userId?: string
    reason: 'OWNER' | 'WORKSPACE_MEMBER' | 'ALREADY_HAS_ROLE'
  }>
}
