import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../service/document.service';
import type { Document } from '../types/document.type';
import type { EditedRect } from '../../comments/types/comment.type'
import { commentThreadKeys } from '../../comments/hooks/comment-query-keys'
import { successToast } from '../../../shared/components/ui/Toast'

interface EditPdfPayload {
  documentId: string
  file: Blob
  editedRects?: EditedRect[]
  degradedAnnotationIds?: string[]
}

export const useEditPdf = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation<Document, Error, EditPdfPayload>({
    mutationFn: ({
      documentId,
      file,
      editedRects = [],
      degradedAnnotationIds = [],
    }) =>
      documentService.editPdf(
        workspaceId,
        documentId,
        file,
        editedRects,
        degradedAnnotationIds,
      ),

    onSuccess: (updatedDocument, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['documents', workspaceId],
      })

      queryClient.setQueryData(
        ['documents', workspaceId, variables.documentId],
        updatedDocument,
      )

      queryClient.invalidateQueries({
        queryKey: ['shared-with-me', 'documents'],
      })

      queryClient.invalidateQueries({
        queryKey: commentThreadKeys.list(workspaceId, variables.documentId),
      })

      successToast('Document edited successfully')
    },
  })
}
