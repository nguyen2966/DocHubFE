import api from '../../../shared/lib/axios'
import type {
  SearchDocumentsParams,
  SearchDocumentsResponse,
  SearchWorkspaceOption,
} from '../types/document-search.type'

function compactSearchParams(params: SearchDocumentsParams) {
  const queryParams: Record<string, string | number> = {}

  if (params.q?.trim()) queryParams.q = params.q.trim()
  if (params.workspaceIds?.length) {
    queryParams.workspaceIds = params.workspaceIds.join(',')
  }
  if (params.updatedFrom) queryParams.updatedFrom = params.updatedFrom
  if (params.updatedTo) queryParams.updatedTo = params.updatedTo
  if (params.page) queryParams.page = params.page
  if (params.limit) queryParams.limit = params.limit
  if (params.sort) queryParams.sort = params.sort

  return queryParams
}

export const documentSearchService = {
  async searchDocuments(
    params: SearchDocumentsParams,
  ): Promise<SearchDocumentsResponse> {
    const res = await api.get<SearchDocumentsResponse>('/documents/search', {
      params: compactSearchParams(params),
    })
    return res.data
  },

  async getSearchWorkspaces(): Promise<SearchWorkspaceOption[]> {
    const res = await api.get<SearchWorkspaceOption[]>(
      '/documents/search/workspaces',
    )
    return res.data
  },
}
