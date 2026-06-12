import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'
import type { ShareDocumentPayload } from '../types/document.type'

interface ShareDocumentVariables {
  documentId: string
  payload: ShareDocumentPayload
}

export const useShareDocument = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ documentId, payload }: ShareDocumentVariables) =>
      documentService.shareDocument(workspaceId, documentId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['document-members', workspaceId, variables.documentId],
      })

      queryClient.invalidateQueries({
        queryKey: ['documents', workspaceId],
      })
    },
  })
}