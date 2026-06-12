import { useEffect, useState } from 'react';
import { workspaceService } from '../services/workspace.service';
import { Workspace } from '../types/workspace.type';

export function useWorkspaceDetail(workspaceId?: string) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!workspaceId) return;

    const fetchWorkspace = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await workspaceService.getWorkspace(workspaceId);
        setWorkspace(result);
      } catch {
        setError('Could not load workspace.')
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
  }
}