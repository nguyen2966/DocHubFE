import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'

interface UploadPdfVariables {
  file: File
  title?: string
}

export const useUploadPdfDocument = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, title }: UploadPdfVariables) =>
      documentService.uploadPdfDocument(workspaceId, file, title),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', workspaceId],
      })
    },
  })
}