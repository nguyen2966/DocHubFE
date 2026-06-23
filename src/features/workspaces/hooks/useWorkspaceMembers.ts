import { useQuery } from '@tanstack/react-query'

import { workspaceService } from '../services/workspace.service'

export function useWorkspaceMembers(workspaceId?: string) {
  return useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: () => workspaceService.getMembers(workspaceId!),
    enabled: Boolean(workspaceId),
  })
}
