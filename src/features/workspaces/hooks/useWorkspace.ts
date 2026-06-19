import { useEffect, useState } from 'react'

import type { PagePaginatedMeta } from '../../../shared/types/pagination.type'
import { workspaceService } from '../services/workspace.service'
import type { Workspace } from '../types/workspace.type'

const WORKSPACE_PAGE_LIMIT = 7

export function useWorkspaces(page = 1) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [meta, setMeta] = useState<PagePaginatedMeta | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkspaces = async () => {
    setIsFetching(true)
    setError(null)

    try {
      const result = await workspaceService.getWorkspaces({
        page,
        limit: WORKSPACE_PAGE_LIMIT,
      })

      setWorkspaces(result.data)
      setMeta(result.meta)
    } catch {
      setError('Could not load workspaces.')
    } finally {
      setIsLoading(false)
      setIsFetching(false)
    }
  }

  useEffect(() => {
    fetchWorkspaces()
  }, [page])

  return {
    workspaces,
    meta,
    isLoading,
    isFetching,
    error,
    refetch: fetchWorkspaces,
  }
}
