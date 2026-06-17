import { useMutation, useQueryClient } from '@tanstack/react-query'

import { commentService } from '../service/comment.service'
import type { EditCommentVariables } from '../types/comment.type'
import { commentThreadKeys } from './comment-query-keys'

export function useEditComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      workspaceId,
      documentId,
      commentId,
      payload,
    }: EditCommentVariables) =>
      commentService.editComment(workspaceId, documentId, commentId, payload),

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