// useUpdateDocumentUserRole.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { documentService } from '../service/document.service'
import type { ShareRole } from '../types/document.type'

export function useUpdateDocumentUserRole(workspaceId: string, documentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: ShareRole }) =>
      documentService.updateDocumentUserRole(workspaceId, documentId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-access', workspaceId, documentId] })
    },
  })
}