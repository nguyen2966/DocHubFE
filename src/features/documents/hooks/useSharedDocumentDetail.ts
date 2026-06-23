import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { documentService } from '../service/document.service'

export const useSharedDocumentDetail = (documentId?: string) => {
  return useQuery({
    queryKey: ['shared-with-me', 'documents', documentId],
    queryFn: () => documentService.getSharedWithMeDocumentDetail(documentId!),
    enabled: Boolean(documentId),
    retry: (failureCount, error) => {
      if (
        isAxiosError(error) &&
        [401, 403].includes(
          error.response?.status ??
            (error.response?.data as { statusCode?: number } | undefined)
              ?.statusCode ??
            0,
        )
      ) {
        return false
      }

      return failureCount < 3
    },
  })
}
