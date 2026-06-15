// useUpdatePendingDocumentShareRole.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'
import type { ShareRole } from '../types/document.type'

export function useUpdatePendingDocumentShareRole(workspaceId: string, documentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ shareId, role }: { shareId: string; role: ShareRole }) =>
      documentService.updatePendingDocumentShareRole(workspaceId, documentId, shareId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-access', workspaceId, documentId] })
    },
  })
}