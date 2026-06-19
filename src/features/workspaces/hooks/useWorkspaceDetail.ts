import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { workspaceService } from '../services/workspace.service';
import { Workspace } from '../types/workspace.type';

export function useWorkspaceDetail(workspaceId?: string) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<number | null>(null)

  useEffect(() => {
    if (!workspaceId) {
      setWorkspace(null)
      setError('Workspace ID is missing.')
      setStatus(404)
      setIsLoading(false)
      return
    }

    const fetchWorkspace = async () => {
      setIsLoading(true)
      setError(null)
      setStatus(null)

      try {
        const result = await workspaceService.getWorkspace(workspaceId);
        setWorkspace(result);

      } catch (error) {
        setWorkspace(null)
        setError('Could not load workspace.')
        setStatus(
          isAxiosError(error)
            ? error.response?.status ??
                (error.response?.data as { statusCode?: number } | undefined)
                  ?.statusCode ??
                null
            : null,
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkspace()
  }, [workspaceId])

  return {
    workspace,
    isLoading,
    error,
    status,
  }
}
