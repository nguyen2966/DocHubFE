import { ArrowLeft } from '@phosphor-icons/react'
import { isAxiosError } from 'axios'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { DocumentDetailExperience } from '../../features/documents/components/details-page/DocumentDetailExperience'
import { useSharedDocumentDetail } from '../../features/documents/hooks/useSharedDocumentDetail'
import { Header } from '../../shared/components/Header'

export function SharedDocumentDetailPage() {
  const navigate = useNavigate()
  const { documentId } = useParams()

  const {
    data: document,
    isLoading,
    isError,
    error,
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

  if (isError) {
    const status = getErrorStatus(error)

    if (status === 401) {
      return <Navigate to="/401" replace />
    }

    if (status === 403) {
      return <Navigate to="/403" replace />
    }
  }

  if (isError || !document || !documentId) {
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
    <DocumentDetailExperience
      workspaceId={document.workspaceId}
      documentId={documentId}
      document={document}
      backElement={
        <button
          type="button"
          onClick={() => navigate('/shared-with-me')}
          className="flex items-center gap-2 text-sm font-medium text-stone-800 hover:text-stone-950"
        >
          <ArrowLeft size={16} />
          Back to Shared with me
        </button>
      }
    />
  )
}

function getErrorStatus(error: unknown) {
  if (!isAxiosError(error)) return null

  return (
    error.response?.status ??
    (error.response?.data as { statusCode?: number } | undefined)
      ?.statusCode ??
    null
  )
}
