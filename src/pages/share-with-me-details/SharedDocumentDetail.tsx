import { ArrowLeft } from '@phosphor-icons/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../shared/components/Header';
import { useSharedDocumentDetail } from '../../features/documents/hooks/useSharedDocumentDetail';
import { DocumentTitleBar } from '../../features/documents/components/details-page/DocumentTitleBar';
import { DocumentViewerToolbar } from '../../features/documents/components/details-page/DocumentViewerToolbar';
import { DocumentViewerShell } from '../../features/documents/components/details-page/DocumentViewerShell';

export function SharedDocumentDetailPage() {
  const navigate = useNavigate()
  const { documentId } = useParams()

  const {
    data: document,
    isLoading,
    isError,
  } = useSharedDocumentDetail(documentId)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header showFunctions />
        <main className="px-8 py-8 text-sm text-stone-500">
          Loading document...
        </main>
      </div>
    )
  }

  if (isError || !document) {
    return (
      <div className="min-h-screen bg-white">
        <Header showFunctions />
        <main className="px-8 py-8 text-sm text-red-500">
          Document not found or you do not have access.
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showFunctions />

      <main className="px-8 py-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/shared-with-me')}
            className="flex items-center gap-2 text-sm font-medium text-stone-800 hover:text-stone-950"
          >
            <ArrowLeft size={16} />
            Back to Shared with me
          </button>

          <DocumentViewerToolbar
            workspaceId={document.workspaceId}
            document={document}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <DocumentTitleBar
            workspaceId={document.workspaceId}
            document={document}
          />

          <DocumentViewerShell document={document} />
        </div>
      </main>
    </div>
  )
}