import { useQuery } from '@tanstack/react-query';
import { documentService } from '../service/document.service';

export const useDocuments = (workspaceId?: string) => {
  return useQuery({
    queryKey: ['documents', workspaceId],
    queryFn: () => documentService.getDocuments(workspaceId!),
    enabled: Boolean(workspaceId),
  })
}