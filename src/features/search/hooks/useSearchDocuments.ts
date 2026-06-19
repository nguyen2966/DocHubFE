import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { documentSearchService } from '../services/documentSearch.service'
import type {
  NormalizedSearchDocumentsResponse,
  SearchDocumentsParams,
} from '../types/document-search.type'

interface UseSearchDocumentsParams extends SearchDocumentsParams {
  open: boolean
}

const DEFAULT_SEARCH_LIMIT = 20

export function useSearchDocuments({
  open,
  q,
  workspaceIds = [],
  updatedFrom,
  updatedTo,
  page = 1,
  limit = DEFAULT_SEARCH_LIMIT,
  sort,
}: UseSearchDocumentsParams) {
  const normalizedWorkspaceIds = useMemo(
    () => [...workspaceIds].sort(),
    [workspaceIds],
  )
  const normalizedQuery = q?.trim() ?? ''
  const effectiveSort = normalizedQuery ? sort : 'updated_desc'

  const query = useQuery({
    queryKey: [
      'document-search',
      normalizedQuery,
      normalizedWorkspaceIds.join(','),
      updatedFrom ?? null,
      updatedTo ?? null,
      page,
      limit,
      effectiveSort ?? null,
    ],
    queryFn: async (): Promise<NormalizedSearchDocumentsResponse> => {
      const response = await documentSearchService.searchDocuments({
        q: normalizedQuery || undefined,
        workspaceIds: normalizedWorkspaceIds,
        updatedFrom,
        updatedTo,
        page,
        limit,
        sort: effectiveSort,
      })

      return {
        items: response.data,
        total: response.meta.totalItems,
        page: response.meta.page,
        limit: response.meta.limit,
        totalPages: response.meta.totalPages,
      }
    },
    enabled: open,
    placeholderData: (previousData) => previousData,
  })

  return {
    ...query,
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? page,
    limit: query.data?.limit ?? limit,
    totalPages: query.data?.totalPages ?? 0,
  }
}
