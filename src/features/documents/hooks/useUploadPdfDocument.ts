import type { AxiosProgressEvent } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../service/document.service';
import { errorToast, successToast } from '../../../shared/components/ui/Toast';

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
      successToast('Document created successfully')
    },

    onError: () => {
      errorToast('Failed to create document')
    },
  })
}
