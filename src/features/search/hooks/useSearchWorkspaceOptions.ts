import { useQuery } from '@tanstack/react-query'

import { documentSearchService } from '../services/documentSearch.service'

export function useSearchWorkspaceOptions(open: boolean) {
  return useQuery({
    queryKey: ['document-search-workspaces'],
    queryFn: documentSearchService.getSearchWorkspaces,
    enabled: open,
    staleTime: 5 * 60 * 1000,
  })
}
