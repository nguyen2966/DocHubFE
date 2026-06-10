import { CreateDocumentButton } from "../create-document/CreateDocumentButton";

interface DocumentHeaderProps {
  total: number
  onUploadPdf: () => void
  onCreateBlank: () => void
}

export function DocumentHeader({ total, onUploadPdf, onCreateBlank }: DocumentHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-stone-900">
          All documents
        </h1>

        <div className="h-6 w-px bg-stone-200" />

        <span className="text-sm text-stone-500">Total {total}</span>
      </div>

      <CreateDocumentButton
        onUploadPdf={onUploadPdf}
        onCreateBlank={onCreateBlank}
      />
    </div>
  )
}