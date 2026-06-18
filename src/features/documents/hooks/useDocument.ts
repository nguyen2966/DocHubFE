import { useQuery } from '@tanstack/react-query'

import { documentService } from '../service/document.service'

const DOCUMENT_PAGE_LIMIT = 10

export const useDocuments = (workspaceId?: string, page = 1) => {
  return useQuery({
    queryKey: ['documents', workspaceId, page],
    queryFn: () =>
      documentService.getDocuments(workspaceId!, {
        page,
        limit: DOCUMENT_PAGE_LIMIT,
      }),
    enabled: Boolean(workspaceId),
    placeholderData: (previousData) => previousData,
  })
}
