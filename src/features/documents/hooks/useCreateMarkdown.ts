import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'
import type { CreateMarkdownDocumentPayload } from '../types/document.type'
import { errorToast, successToast } from '../../../shared/components/ui/Toast'

export const useCreateMarkdownDocument = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMarkdownDocumentPayload) =>
      documentService.createMarkdownDocument(workspaceId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', workspaceId],
      })
      successToast('Document created successfully')
    },

    onError: () => {
      errorToast('Failed to create document')
    },
  })
}
