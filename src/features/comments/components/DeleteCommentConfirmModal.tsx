import { DeleteConfirmModal } from '../../../shared/components/ui/DeleteConfirmModal'

interface DeleteCommentConfirmModalProps {
  open: boolean
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteCommentConfirmModal({
  open,
  loading,
  onClose,
  onConfirm,
}: DeleteCommentConfirmModalProps) {
  return (
    <DeleteConfirmModal
      open={open}
      loading={loading}
      title="Delete comment?"
      description="Are you sure you want to delete this comment? It will appear as a deleted comment in the thread."
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}
