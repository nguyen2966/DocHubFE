import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import { workspaceService } from '../services/workspace.service'

function getErrorStatus(error: unknown) {
  if (!isAxiosError(error)) return null

  return (
    error.response?.status ??
    (error.response?.data as { statusCode?: number } | undefined)
      ?.statusCode ??
    null
  )
}

export function useWorkspaceDetail(workspaceId?: string) {
  const query = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => workspaceService.getWorkspace(workspaceId!),
    enabled: Boolean(workspaceId),
    retry: false,
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  })

  const missingWorkspaceId = !workspaceId
  const status = missingWorkspaceId ? 404 : getErrorStatus(query.error)
  const error = missingWorkspaceId
    ? 'Workspace ID is missing.'
    : query.error
      ? 'Could not load workspace.'
      : null

  return {
    ...query,
    workspace: query.data ?? null,
    isLoading: Boolean(workspaceId) && query.isLoading,
    error,
    status,
  }
}
