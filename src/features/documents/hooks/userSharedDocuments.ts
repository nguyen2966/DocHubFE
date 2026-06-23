import { useQuery } from '@tanstack/react-query'
import { documentService } from '../service/document.service'

interface UseSharedDocumentsParams {
  page?: number
  limit?: number
}

export const useSharedDocuments = (params?: UseSharedDocumentsParams) => {
  return useQuery({
    queryKey: ['shared-with-me', 'documents', params],
    queryFn: () => documentService.getSharedWithMeDocuments(params),
  })
}
