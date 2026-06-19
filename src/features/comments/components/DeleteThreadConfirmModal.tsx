import { DeleteConfirmModal } from '../../../shared/components/ui/DeleteConfirmModal'

interface DeleteThreadConfirmModalProps {
  open: boolean
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteThreadConfirmModal({
  open,
  loading,
  onClose,
  onConfirm,
}: DeleteThreadConfirmModalProps) {
  return (
    <DeleteConfirmModal
      open={open}
      loading={loading}
      title="Delete thread?"
      description="This will delete the whole discussion thread and all of its replies from the document view."
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}
