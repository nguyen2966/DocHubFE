import { useMutation, useQueryClient } from '@tanstack/react-query'

import { commentService } from '../service/comment.service'
import type { DeleteCommentVariables } from '../types/comment.type'
import { commentThreadKeys } from './comment-query-keys'

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ workspaceId, documentId, commentId }: DeleteCommentVariables) =>
      commentService.deleteComment(workspaceId, documentId, commentId),

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