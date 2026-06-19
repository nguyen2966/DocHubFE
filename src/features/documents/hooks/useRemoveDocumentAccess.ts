// useRemoveDocumentAccess.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'
import { errorToast, successDeleteToast } from '../../../shared/components/ui/Toast'

export function useRemoveDocumentAccess(workspaceId: string, documentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) =>
      documentService.removeDocumentAccess(workspaceId, documentId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-access', workspaceId, documentId] })
      successDeleteToast('Document access removed successfully')
    },
    onError: () => {
      errorToast('Failed to remove document access')
    },
  })
}
