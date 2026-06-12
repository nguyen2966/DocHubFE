// import { Trash } from '@phosphor-icons/react';

// interface DeleteWorkspaceModalProps {
//   open: boolean
//   isDeleting?: boolean
//   onClose: () => void
//   onConfirm: () => void
// }

// export function DeleteWorkspaceModal({
//   open,
//   isDeleting = false,
//   onClose,
//   onConfirm,
// }: DeleteWorkspaceModalProps) {
//   if (!open) return null

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
//       <div className="w-[400px] rounded-xl bg-white shadow-xl">
//         <div className="flex gap-4 px-5 py-5">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
//             <Trash size={20} weight="bold" />
//           </div>

//           <div>
//             <h3 className="text-base font-semibold text-stone-950">
//               Delete this workspace?
//             </h3>
//             <p className="mt-2 text-sm leading-5 text-stone-500">
//               This will permanently delete all documents, memberships, and
//               associated data.
//             </p>
//           </div>
//         </div>

//         <div className="flex justify-end gap-2 border-t border-stone-100 px-5 py-4">
//           <button
//             type="button"
//             disabled={isDeleting}
//             onClick={onClose}
//             className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-900 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             disabled={isDeleting}
//             onClick={onConfirm}
//             className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isDeleting ? 'Deleting...' : 'Delete'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

import { Trash } from '@phosphor-icons/react';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';

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
    <ConfirmModal
      open={open}
      loading={isDeleting}
      title="Delete this workspace?"
      description="This will permanently delete all documents, memberships, and associated data."
      confirmText="Delete"
      confirmButtonClassName="bg-red-50 text-red-600 hover:bg-red-100"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
          <Trash size={20} weight="bold" />
        </div>
      }
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}