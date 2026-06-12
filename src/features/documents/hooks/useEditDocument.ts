import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../service/document.service';
import type { Document } from '../types/document.type';

interface EditPdfPayload {
  documentId: string
  file: Blob
}

export const useEditPdf = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation<Document, Error, EditPdfPayload>({
    mutationFn: ({ documentId, file }) =>
      documentService.editPdf(workspaceId, documentId, file),

    onSuccess: (updatedDocument) => {
      queryClient.invalidateQueries({
        queryKey: ['documents', workspaceId],
      })

      queryClient.invalidateQueries({
        queryKey: ['document-detail', workspaceId, updatedDocument._id],
      })
    },
  })
}