// useShareDocumentAccess.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'
import type { ShareDocumentAccessPayload } from '../types/document.type'

export function useShareDocumentAccess(workspaceId: string, documentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ShareDocumentAccessPayload) =>
      documentService.shareDocumentAccess(workspaceId, documentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-access', workspaceId, documentId] })
      queryClient.invalidateQueries({ queryKey: ['documents', workspaceId] })
    },
  })
}