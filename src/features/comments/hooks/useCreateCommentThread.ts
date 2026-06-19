import { useMutation, useQueryClient } from '@tanstack/react-query'

import { commentService } from '../service/comment.service'
import type { CreateCommentThreadVariables } from '../types/comment.type'
import { commentThreadKeys } from './comment-query-keys'
import { errorToast, successToast } from '../../../shared/components/ui/Toast'

export function useCreateCommentThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      workspaceId,
      documentId,
      payload,
    }: CreateCommentThreadVariables) =>
      commentService.createCommentThread(workspaceId, documentId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentThreadKeys.list(
          variables.workspaceId,
          variables.documentId,
        ),
      })
      successToast('Comment created successfully')
    },

    onError: () => {
      errorToast('Failed to create comment')
    },
  })
}
