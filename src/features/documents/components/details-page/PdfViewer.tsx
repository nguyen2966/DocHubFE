interface PdfViewerProps {
  fileUrl: string
}

export function PdfViewer({ fileUrl }: PdfViewerProps) {
  if (!fileUrl) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-stone-50 text-sm text-stone-500">
        PDF file is not available.
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-220px)] min-h-[600px] bg-stone-100">
      <iframe
        src={fileUrl}
        title="PDF Viewer"
        className="h-full w-full border-0"
      />
    </div>
  )
}