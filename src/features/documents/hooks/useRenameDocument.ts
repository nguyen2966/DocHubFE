import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'
import type { RenameDocumentPayload } from '../types/document.type'

interface RenameDocumentVariables {
  documentId: string
  payload: RenameDocumentPayload
}

export const useRenameDocument = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ documentId, payload }: RenameDocumentVariables) =>
      documentService.renameDocument(workspaceId, documentId, payload),

    onSuccess: (updatedDocument) => {
      queryClient.invalidateQueries({
        queryKey: ['documents', workspaceId],
      })

      queryClient.setQueryData(
        ['documents', workspaceId, updatedDocument._id],
        updatedDocument,
      )
    },
  })
}