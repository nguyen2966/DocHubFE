import { useQuery } from '@tanstack/react-query'

import { commentService } from '../service/comment.service'
import { normalizeRawThreads } from '../utils/comment-adapter.util'
import { sortThreadsByNewestRoot } from '../utils/comment-tree.util'
import { commentThreadKeys } from './comment-query-keys'

export function useCommentThreads(
  workspaceId?: string | null,
  documentId?: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: commentThreadKeys.list(workspaceId ?? '', documentId ?? ''),
    queryFn: async () => {
      const rawThreads = await commentService.getCommentThreads(
        workspaceId!,
        documentId!,
      )

      return sortThreadsByNewestRoot(normalizeRawThreads(rawThreads))
    },
    enabled: Boolean(workspaceId && documentId && enabled),
  })
}