import EmptyPage from '../../../../assets/upload.png';
import { TextT } from '@phosphor-icons/react';

interface DocumentEmptyStateProps {
  onUploadPdf?: () => void
  onCreateBlank?: () => void
}

export function DocumentEmptyState({
  onUploadPdf,
  onCreateBlank,
}: DocumentEmptyStateProps) {
  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        onClick={onUploadPdf}
        className="
          flex min-h-[470px] w-full cursor-pointer flex-col
          items-center justify-center
          rounded-2xl border border-dashed border-slate-300
          bg-white transition-colors hover:border-slate-400
        "
      >
        {/* Placeholder image */}
        <div className="mb-10 flex items-center justify-center">
  <img
    src={EmptyPage}
    alt="Empty documents"
    className="max-h-[220px] w-auto object-contain"
  />
</div>

        <h3 className="text-xl font-semibold text-stone-900">
          Upload your first document
        </h3>

        <p className="mt-2 text-base text-stone-500">
          Drag & drop or click to upload a PDF (max 20MB).
        </p>
      </div>

      {/* Divider Text */}
      <div className="mt-10 text-center">
        <p className="text-lg text-stone-500">
          or start from scratch
        </p>
      </div>

      {/* Create Blank Button */}
      <div className="mt-4 flex justify-center">
        <button className="flex items-center gap-2 mt-3 rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium hover:bg-stone-50"> <TextT/> New blank document </button> 
      </div>
    </div>
  )
}