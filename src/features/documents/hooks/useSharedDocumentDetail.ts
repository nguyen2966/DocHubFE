import { useQuery } from '@tanstack/react-query'
import { documentService } from '../service/document.service'

export const useSharedDocumentDetail = (documentId?: string) => {
  return useQuery({
    queryKey: ['shared-with-me', 'documents', documentId],
    queryFn: () => documentService.getSharedWithMeDocumentDetail(documentId!),
    enabled: Boolean(documentId),
  })
}