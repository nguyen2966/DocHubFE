// useRemovePendingDocumentShare.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'

export function useRemovePendingDocumentShare(workspaceId: string, documentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (shareId: string) =>
      documentService.removePendingDocumentShare(workspaceId, documentId, shareId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-access', workspaceId, documentId] })
    },
  })
}