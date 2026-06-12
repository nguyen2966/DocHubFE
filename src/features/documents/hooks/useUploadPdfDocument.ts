import type { AxiosProgressEvent } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../service/document.service';

interface UploadPdfVariables {
  file: File
  title?: string
  onUploadProgress?: (event: AxiosProgressEvent) => void
}

export const useUploadPdfDocument = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, title, onUploadProgress }: UploadPdfVariables) =>
      documentService.uploadPdfDocument(
        workspaceId,
        file,
        title,
        onUploadProgress,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', workspaceId],
      })
    },
  })
}