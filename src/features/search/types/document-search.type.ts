import type { PagePaginatedResponse } from '../../../shared/types/pagination.type'

export type SearchDocumentSourceType = 'md_editor' | 'file_upload'
export type SearchAccessType = 'workspace' | 'direct'
export type SearchDocumentRole = 'viewer' | 'commenter' | 'editor'
export type SearchSort = 'relevance' | 'updated_desc' | 'updated_asc'
export type UpdatedPreset =
  | 'any'
  | 'today'
  | 'yesterday'
  | 'past_7_days'
  | 'past_30_days'
  | 'past_year'

export interface SearchDocumentItem {
  documentId: string
  title: string
  workspace: {
    workspaceId: string
    name: string
  }
  sourceType: SearchDocumentSourceType
  previewText: string
  updatedAt: string
  accessType: SearchAccessType
  role?: SearchDocumentRole
}

export interface SearchDocumentsParams {
  q?: string
  workspaceIds?: string[]
  updatedFrom?: string
  updatedTo?: string
  page?: number
  limit?: number
  sort?: SearchSort
}

export type SearchDocumentsResponse =
  PagePaginatedResponse<SearchDocumentItem>

export interface SearchPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface NormalizedSearchDocumentsResponse
  extends SearchPaginationMeta {
  items: SearchDocumentItem[]
}

export interface SearchWorkspaceOption {
  workspaceId: string
  name: string
  role?: 'admin' | 'member'
}
