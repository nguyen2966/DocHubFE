import { DeleteConfirmModal } from '../../../shared/components/ui/DeleteConfirmModal'

interface DeleteWorkspaceModalProps {
  open: boolean
  isDeleting?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteWorkspaceModal({
  open,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteWorkspaceModalProps) {
  return (
    <DeleteConfirmModal
      open={open}
      loading={isDeleting}
      title="Delete this workspace?"
      description="This will permanently delete all documents, memberships, and associated data."
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}
