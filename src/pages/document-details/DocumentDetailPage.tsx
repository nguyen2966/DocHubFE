import { Navigate, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'

import { DocumentBackButton } from '../../features/documents/components/details-page/DocumentBackButton'
import { DocumentDetailExperience } from '../../features/documents/components/details-page/DocumentDetailExperience'
import { useDocumentDetail } from '../../features/documents/hooks/useDocumentDetail'

export function WorkspaceDocumentDetailPage() {
  const { workspaceId, documentId } = useParams()

  const {
    data: document,
    isLoading,
    isError,
    error: documentError,
  } = useDocumentDetail(workspaceId, documentId)

  if (isLoading) {
    return <div className="text-sm text-stone-500">Loading document...</div>
  }

  if (
    isAxiosError(documentError) &&
    (documentError.response?.status === 400 ||
      documentError.response?.status === 404 ||
      [400, 404].includes(
        (documentError.response?.data as { statusCode?: number } | undefined)
          ?.statusCode ?? 0,
      ))
  ) {
    return <Navigate to="/404" replace />
  }

  if (isError || !document || !workspaceId || !documentId) {
    return <div className="text-sm text-red-500">Document not found.</div>
  }

  return (
    <DocumentDetailExperience
      workspaceId={workspaceId}
      documentId={documentId}
      document={document}
      backElement={<DocumentBackButton workspaceId={workspaceId} />}
    />
  )
}
