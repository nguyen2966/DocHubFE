import { useQuery } from '@tanstack/react-query'
import { documentService } from '../service/document.service'

export function useDocumentAccess(
  workspaceId: string,
  documentId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ['document-access', workspaceId, documentId],
    queryFn: () => documentService.getDocumentAccess(workspaceId, documentId),
    enabled: enabled && !!workspaceId && !!documentId,
  })
}