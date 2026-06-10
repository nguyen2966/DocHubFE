import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'

export const useDeleteDocument = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (documentId: string) =>
      documentService.deleteDocument(workspaceId, documentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', workspaceId],
      })
    },
  })
}