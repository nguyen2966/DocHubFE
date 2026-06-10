import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'
import type { CreateMarkdownDocumentPayload } from '../types/document.type'

export const useCreateMarkdownDocument = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMarkdownDocumentPayload) =>
      documentService.createMarkdownDocument(workspaceId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', workspaceId],
      })
    },
  })
}