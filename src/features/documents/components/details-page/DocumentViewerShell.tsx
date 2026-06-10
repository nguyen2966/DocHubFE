// import type { Document } from '../../types/document.type';
// import { MarkdownViewer } from './MarkdownViewer';
// import { PdfViewer } from './PdfViewer';

// interface DocumentViewerShellProps {
//   document: Document
// }

// export function DocumentViewerShell({ document }: DocumentViewerShellProps) {
//   if (document.processingStatus === 'processing') {
//     return (
//       <div className="flex min-h-[600px] items-center justify-center bg-stone-50 text-sm text-stone-500">
//         Processing document...
//       </div>
//     )
//   }

//   if (
//     document.processingStatus === 'failed' ||
//     document.processingStatus === 'unprocessable'
//   ) {
//     return (
//       <div className="flex min-h-[600px] items-center justify-center bg-stone-50 text-sm text-red-500">
//         This document cannot be processed.
//       </div>
//     )
//   }

//   if (document.sourceType === 'md_editor') {
//     return (
//       <MarkdownViewer content={document.markdownContent ?? ''} />
//     )
//   }

//   return (
//     <PdfViewer fileUrl={document.pdfFileUrl ?? ''} />
//   )
// }

import type { Document } from '../../types/document.type'
import { MarkdownViewer } from './MarkdownViewer'
import { PdfViewer } from './PdfViewer'

interface DocumentViewerShellProps {
  document: Document
}

export function DocumentViewerShell({ document }: DocumentViewerShellProps) {
  if (document.processingStatus === 'processing') {
    return (
      <div className="flex h-full items-center justify-center bg-stone-50 text-sm text-stone-500">
        Processing document...
      </div>
    )
  }

  if (
    document.processingStatus === 'failed' ||
    document.processingStatus === 'unprocessable'
  ) {
    return (
      <div className="flex h-full items-center justify-center bg-stone-50 text-sm text-red-500">
        This document cannot be processed.
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-stone-100 px-6 py-6">
      {document.sourceType === 'md_editor' ? (
        <div className="mx-auto w-full max-w-[760px] rounded-sm bg-white px-10 py-8 shadow-sm">
          <MarkdownViewer content={document.markdownContent ?? ''} />
        </div>
      ) : (
        <div className="mx-auto h-full w-full max-w-[760px] overflow-hidden bg-white shadow-sm">
          <PdfViewer fileUrl={document.pdfFileUrl ?? ''} />
        </div>
      )}
    </div>
  )
}