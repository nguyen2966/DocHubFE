import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'
import { errorToast, successDeleteToast } from '../../../shared/components/ui/Toast'

interface RemoveDocumentAccessVariables {
  documentId: string
  userId: string
}

export const useRemoveDocumentAccess = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ documentId, userId }: RemoveDocumentAccessVariables) =>
      documentService.removeDocumentAccess(workspaceId, documentId, userId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['document-members', workspaceId, variables.documentId],
      })

      queryClient.invalidateQueries({
        queryKey: ['documents', workspaceId],
      })

      successDeleteToast('Document access removed successfully')
    },

    onError: () => {
      errorToast('Failed to remove document access')
    },
  })
}
