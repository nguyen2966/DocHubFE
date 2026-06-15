import { useQuery } from '@tanstack/react-query'
import { activityService } from '../services/activity.service'

export function useWorkspaceActivityActors(workspaceId?: string) {
  return useQuery({
    queryKey: ['workspace-activity-actors', workspaceId],
    queryFn: () => activityService.getWorkspaceActivityActors(workspaceId!),
    enabled: Boolean(workspaceId),
  })
}