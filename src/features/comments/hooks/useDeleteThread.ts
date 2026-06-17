import { useMutation, useQueryClient } from '@tanstack/react-query'

import { commentService } from '../service/comment.service'
import type { AnnotationActionVariables } from '../types/comment.type'
import { commentThreadKeys } from './comment-query-keys'

export function useDeleteThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ workspaceId, documentId, annotationId }: AnnotationActionVariables) =>
      commentService.deleteThread(workspaceId, documentId, annotationId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentThreadKeys.list(
          variables.workspaceId,
          variables.documentId,
        ),
      })
    },
  })
}