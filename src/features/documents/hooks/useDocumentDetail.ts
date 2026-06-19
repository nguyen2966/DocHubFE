import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
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
    retry: (failureCount, error) => {
      if (
        isAxiosError(error) &&
        [400, 404].includes(
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
