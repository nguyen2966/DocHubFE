import { useQuery } from '@tanstack/react-query'
import { documentService } from '../service/document.service'

export function useSearchDocumentUsers(
  workspaceId: string,
  documentId: string,
  email: string,
) {
  const query = email.trim()

  return useQuery({
    queryKey: ['document-user-search', workspaceId, documentId, query],
    queryFn: () =>
      documentService.searchDocumentUsers(workspaceId, documentId, query),
    enabled: !!workspaceId && !!documentId && query.length > 0,
  })
}
