import { useMutation, useQueryClient } from '@tanstack/react-query'

import { commentService } from '../service/comment.service'
import type { CreateCommentReplyVariables } from '../types/comment.type'
import { commentThreadKeys } from './comment-query-keys'
import { errorToast, successToast } from '../../../shared/components/ui/Toast'

export function useCreateCommentReply() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      workspaceId,
      documentId,
      annotationId,
      payload,
    }: CreateCommentReplyVariables) =>
      commentService.createCommentReply(
        workspaceId,
        documentId,
        annotationId,
        payload,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentThreadKeys.list(
          variables.workspaceId,
          variables.documentId,
        ),
      })
      successToast('Reply created successfully')
    },

    onError: () => {
      errorToast('Failed to create reply')
    },
  })
}
