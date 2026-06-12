import { useParams } from 'react-router-dom'
import { useDocumentDetail } from '../../features/documents/hooks/useDocumentDetail'
import { DocumentBackButton } from '../../features/documents/components/details-page/DocumentBackButton';
import { DocumentTitleBar } from '../../features/documents/components/details-page/DocumentTitleBar';
import { DocumentViewerToolbar } from '../../features/documents/components/details-page/DocumentViewerToolbar';
import { DocumentViewerShell } from '../../features/documents/components/details-page/DocumentViewerShell';
import { Header } from '../../shared/components/Header';
import { useState, useRef } from 'react';
import { AprysePdfViewerRef } from '../../features/documents/components/details-page/AprysePdfViewer';
import { useEditPdf } from '../../features/documents/hooks/useEditDocument';

export function WorkspaceDocumentDetailPage() {
  const { workspaceId, documentId } = useParams()

  const { data: document, isLoading, isError } = useDocumentDetail(workspaceId, documentId);
  const [isPdfEditing, setIsPdfEditing] = useState(false);
  const apryseViewerRef = useRef<AprysePdfViewerRef | null>(null)

  const editPdfMutation = useEditPdf(workspaceId as string);

  const handleSavePdf = async () => {
    if (!documentId) return

    const file = await apryseViewerRef.current?.exportEditedPdf()
    if (!file) return

    await editPdfMutation.mutateAsync({
      documentId,
      file,
    })

    setIsPdfEditing(false)
  }

  if (isLoading) {
    return <div className="text-sm text-stone-500">Loading document...</div>
  }

  if (isError || !document || !workspaceId || !documentId) {
    return <div className="text-sm text-red-500">Document not found.</div>
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Header showFunctions />

      <main className="flex min-h-0 flex-1 flex-col px-6 py-5">
        <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col">
          <div className="mb-4 flex shrink-0 items-center justify-between">
            <DocumentBackButton workspaceId={workspaceId} />

            <DocumentViewerToolbar
              workspaceId={workspaceId}
              document={document}
              isPdfEditing={isPdfEditing}
              onStartEditPdf={() => setIsPdfEditing(true)}
              onCancelEditPdf={() => setIsPdfEditing(false)}
              isSavingPdf={editPdfMutation.isPending}
              onSavePdf={handleSavePdf}
            />
          </div>

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
            <DocumentTitleBar
              workspaceId={workspaceId}
              document={document}
            />

            <div className="min-h-0 flex-1 overflow-hidden">
              <DocumentViewerShell
                document={document}
                isPdfEditing={isPdfEditing}
                viewerRef={apryseViewerRef}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}