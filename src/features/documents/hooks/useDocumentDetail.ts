import { useQuery } from '@tanstack/react-query'
import { documentService } from '../service/document.service'

export const useDocumentDetail = (
  workspaceId?: string,
  documentId?: string,
) => {
  return useQuery({
    queryKey: ['documents', workspaceId, documentId],
    queryFn: () =>
      documentService.getDocumentDetail(workspaceId!, documentId!),
    enabled: Boolean(workspaceId && documentId),
  })
}