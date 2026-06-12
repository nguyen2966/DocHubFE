import type { Document } from "../../types/document.type";
import { AprysePdfViewer } from './AprysePdfViewer';
import { AprysePdfViewerRef } from "./AprysePdfViewer";

interface DocumentViewerShellProps {
  document: Document,
  isPdfEditing: boolean,
  viewerRef: RefObject<AprysePdfViewerRef | null>
}

export function DocumentViewerShell({ document, isPdfEditing, viewerRef }: DocumentViewerShellProps) {
  if (document.processingStatus === 'processing') {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-stone-50 text-sm text-stone-500">
        Processing document...
      </div>
    )
  }

  if (
    document.processingStatus === 'failed' ||
    document.processingStatus === 'unprocessable'
  ) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-stone-50 text-sm text-red-500">
        This document cannot be processed.
      </div>
    )
  }

  if (!document.pdfFileUrl) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-stone-50 text-sm text-stone-500">
        PDF file is not available.
      </div>
    )
  }

  return <AprysePdfViewer
           ref={viewerRef}
           fileUrl={document.pdfFileUrl}
           isPdfEditing={isPdfEditing} />
}