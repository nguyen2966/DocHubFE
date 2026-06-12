import { useQuery } from '@tanstack/react-query'
import { documentService } from '../service/document.service'

export const useDocumentMembers = (
  workspaceId?: string,
  documentId?: string,
) => {
  return useQuery({
    queryKey: ['document-members', workspaceId, documentId],
    queryFn: () =>
      documentService.getDocumentMembers(workspaceId!, documentId!),
    enabled: Boolean(workspaceId && documentId),
  })
}