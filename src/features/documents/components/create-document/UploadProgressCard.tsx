
// import { FilePdf } from '@phosphor-icons/react';
// import type { UploadJobStatus } from '../../types/document.type';

// interface UploadProgressCardProps {
//   fileName: string
//   fileSize: number
//   progress: number
//   status: UploadJobStatus
//   loading: boolean
//   error?: string | null
//   onCancel?: () => void
// }

// const STATUS_LABEL: Record<UploadJobStatus, string> = {
//   PENDING:    'Preparing...',
//   UPLOADING:  'Uploading file...',
//   FILE_SAVED: 'Saving file...',
//   EXTRACTING: 'Extracting PDF...',
//   COMPLETED:  'Completed',
//   FAILED:     'Upload failed',
//   CANCELLED:  'Cancelled',
// }

// export function UploadProgressCard({
//   fileName,
//   fileSize,
//   progress,
//   status,
//   loading,
//   error,
//   onCancel,
// }: UploadProgressCardProps) {
//   const fileSizeMb = fileSize / 1024 / 1024
//   const isCancellable = loading && status !== 'CANCELLED'
//   const isCompleted = status === 'COMPLETED'
//   const isFailed = status === 'FAILED' || !!error

//   return (
//     <div className="fixed bottom-6 right-6 z-50 w-[420px] rounded-xl border border-stone-200 bg-white p-4 shadow-xl">
//       <div className="flex items-start gap-3">

//         {/* Icon */}
//         <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-stone-200 text-[10px] font-bold">
//           <FilePdf size={18} />
//           PDF
//         </div>

//         <div className="min-w-0 flex-1">
//           <div className="flex items-start justify-between gap-3">

//             {/* File name + status label */}
//             <div className="min-w-0">
//               <p className="truncate text-sm font-semibold text-stone-900">
//                 {fileName}
//               </p>
//               <p className="mt-1 text-xs text-stone-500">
//                 {fileSizeMb.toFixed(1)} MB ·{' '}
//                 <span className={isFailed ? 'text-red-500' : isCompleted ? 'text-green-600' : ''}>
//                   {STATUS_LABEL[status]}
//                 </span>
//               </p>
//             </div>

//             {/* Cancel button — ẩn khi không còn cancellable */}
//             {onCancel && isCancellable && (
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 className="shrink-0 rounded-lg border border-stone-200 px-3 py-1 text-xs
//                            font-medium transition-colors hover:border-red-200 hover:bg-red-50
//                            hover:text-red-600"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>

//           {/* Progress bar */}
//           <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-200">
//             <div
//               className={`h-full rounded-full transition-all duration-300 ease-out ${
//                 isFailed   ? 'bg-red-500'   :
//                 isCompleted ? 'bg-green-500' :
//                               'bg-stone-900'
//               }`}
//               style={{ width: `${progress}%` }}
//             />
//           </div>

//           {/* Error message */}
//           {error && (
//             <p className="mt-2 text-xs text-red-500">{error}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

import {
  CheckCircle,
  FilePdf,
  SpinnerGap,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
import type { UploadJobStatus } from '../../types/document.type'

interface UploadProgressCardProps {
  fileName: string
  fileSize: number
  progress: number
  status: UploadJobStatus
  loading: boolean
  error?: string | null
  onCancel?: () => void
  onClose?: () => void
  onView?: () => void
}

const STATUS_LABEL: Record<UploadJobStatus, string> = {
  PENDING: 'Preparing...',
  UPLOADING: 'Uploading...',
  FILE_SAVED: 'Saving file...',
  EXTRACTING: 'Extracting PDF...',
  COMPLETED: 'Completed',
  FAILED: 'Upload failed',
  CANCELLED: 'Cancelled',
}

export function UploadProgressCard({
  fileName,
  fileSize,
  progress,
  status,
  loading,
  error,
  onCancel,
  onClose,
  onView,
}: UploadProgressCardProps) {
  const fileSizeMb = fileSize / 1024 / 1024

  const isCompleted = status === 'COMPLETED';
  const isFailed = status === 'FAILED' || !!error;
  const isCancelled = status === 'CANCELLED';
  const isWorking = loading && !isCompleted && !isFailed && !isCancelled;

  const displayedUploadedMb = (fileSizeMb * progress) / 100

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] rounded-xl border border-stone-200 bg-white p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-[10px] font-bold text-stone-950">
          <FilePdf size={20} />
          PDF
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-stone-950">
                {fileName}
              </p>

              {isFailed ? (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-red-600">
                  <WarningCircle size={15} />
                  <span>{error ?? 'Upload failed. Please try again.'}</span>
                </p>
              ) : (
                <p className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                  <span>
                    {displayedUploadedMb.toFixed(0)} MB / {fileSizeMb.toFixed(0)} MB
                  </span>
                  <span>·</span>

                  {isCompleted ? (
                    <span className="flex items-center gap-1.5 text-green-700">
                      <CheckCircle size={15} weight="fill" />
                      {STATUS_LABEL[status]}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-stone-950">
                      <SpinnerGap size={15} className="animate-spin" />
                      {STATUS_LABEL[status]}
                    </span>
                  )}
                </p>
              )}
            </div>

            {isWorking && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="shrink-0 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-950 transition-colors hover:bg-stone-50"
              >
                Cancel
              </button>
            )}

            {isCompleted && onView && (
              <button
                type="button"
                onClick={onView}
                className="shrink-0 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-950 transition-colors hover:bg-stone-50"
              >
                View
              </button>
            )}

            {(isFailed || isCancelled) && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-200 text-stone-950 transition-colors hover:bg-stone-50"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {!isCompleted && !isFailed && !isCancelled && (
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-stone-950 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}