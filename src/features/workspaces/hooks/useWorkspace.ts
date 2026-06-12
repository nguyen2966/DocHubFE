import { useEffect, useState } from 'react'
import { workspaceService } from '../services/workspace.service'
import { Workspace } from '../types/workspace.type'

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkspaces = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await workspaceService.getWorkspaces();
     // console.log(result);

      setWorkspaces(result.data);
      setNextCursor(result.meta.nextCursor);
      setHasMore(result.meta.hasMore);
    } catch {
      setError('Could not load workspaces.');
    } finally {
      setIsLoading(false);
    }
  }

  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return

    setIsLoadingMore(true)

    try {
      const result = await workspaceService.getWorkspaces({
        cursor: nextCursor,
      })

      setWorkspaces((prev) => [...prev, ...result.data])
      setNextCursor(result.meta.nextCursor)
      setHasMore(result.meta.hasMore)
    } catch {
      setError('Could not load more workspaces.')
    } finally {
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  return {
    workspaces,
    nextCursor,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    refetch: fetchWorkspaces,
    loadMore,
  }
}