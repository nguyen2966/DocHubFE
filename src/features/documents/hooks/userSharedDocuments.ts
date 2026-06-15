import { useQuery } from '@tanstack/react-query'
import { documentService } from '../service/document.service'

export const useSharedDocuments = () => {
  return useQuery({
    queryKey: ['shared-with-me', 'documents'],
    queryFn: documentService.getSharedWithMeDocuments,
  })
}