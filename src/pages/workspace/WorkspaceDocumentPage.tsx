import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'

import { DocumentEmptyState } from '../../features/documents/components/create-document/DocumentEmptyState'
import { UploadProgressCard } from '../../features/documents/components/create-document/UploadProgressCard'
import { DocumentHeader } from '../../features/documents/components/main-page/DocumentHeader'
import { DocumentTable } from '../../features/documents/components/main-page/DocumentTable'
import { CreateDocumentModal } from '../../features/documents/components/create-document/CreateDocumentModal'
import { useCreateMarkdownDocument } from '../../features/documents/hooks/useCreateMarkdown'
import { useDocuments } from '../../features/documents/hooks/useDocument'
import { useUploadPdfWithProgress } from '../../features/documents/hooks/useUploadPdfWithProgress'
import { Pagination } from '../../shared/components/Pagination'

function getErrorStatus(error: unknown) {
  if (!isAxiosError(error)) return null

  return (
    error.response?.status ??
    (error.response?.data as { statusCode?: number } | undefined)
      ?.statusCode ??
    null
  )
}

export function WorkspaceDocumentsPage() {
  const { workspaceId } = useParams()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const documentsQuery = useDocuments(workspaceId, page)
  const documents = documentsQuery.data?.data ?? []
  const meta = documentsQuery.data?.meta
  const documentsErrorStatus = getErrorStatus(documentsQuery.error)

  const createDocumentMutation = useCreateMarkdownDocument(workspaceId!)
  const {
    upload: uploadPdfMutation,
    cancel: cancelUpload,
    reset: resetUpload,
    job: uploadJob,
  } = useUploadPdfWithProgress(workspaceId!)

  const openPdfFileSelector = () => {
    fileInputRef.current?.click()
  }

  const handlePdfFile = (file: File) => {
    if (!workspaceId) return

    if (file.type !== 'application/pdf') {
      setSelectedFile(file)
      setLocalError('Only PDF files are supported.')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setSelectedFile(file)
      setLocalError('PDF file must be less than 20MB.')
      return
    }

    setLocalError(null)
    setSelectedFile(file)

    uploadPdfMutation.mutate({
      file,
      title: file.name.replace(/\.pdf$/i, ''),
    })
  }

  const handleSelectedPdf = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    handlePdfFile(file)
  }

  const handleCancel = async () => {
    await cancelUpload()
    setSelectedFile(null)
    setLocalError(null)
    fileInputRef.current && (fileInputRef.current.value = '')
  }

  const handleCloseUploadCard = () => {
    setSelectedFile(null)
    setLocalError(null)
    resetUpload()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCreateDocument = (title: string, content: string) => {
    if (!workspaceId) return

    createDocumentMutation.mutate(
      { title, markdownContent: content, sourceType: 'md_editor' },
      { onSuccess: () => setCreateModalOpen(false) },
    )
  }

  const handleViewUploadedDocument = () => {
    if (!workspaceId || !uploadJob?.documentId) return

    navigate(`/workspaces/${workspaceId}/documents/${uploadJob.documentId}`)
  }

  if (!workspaceId) {
    return <div className="text-sm text-red-500">Workspace ID is missing.</div>
  }

  if (documentsErrorStatus === 401) return <Navigate to="/401" replace />
  if (documentsErrorStatus === 403) return <Navigate to="/403" replace />
  if (documentsErrorStatus === 404) return <Navigate to="/404" replace />

  if (documentsQuery.isLoading) {
    return <div className="text-sm text-stone-500">Loading documents...</div>
  }

  if (documentsQuery.isError) {
    return (
      <div className="text-sm text-red-500">
        Could not load documents. Please try again.
      </div>
    )
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleSelectedPdf}
      />

      <DocumentHeader
        total={meta?.totalItems ?? documents.length}
        onUploadPdf={openPdfFileSelector}
        onCreateBlank={() => setCreateModalOpen(true)}
      />

      {documents.length === 0 ? (
        <DocumentEmptyState
          onUploadPdf={openPdfFileSelector}
          onCreateBlank={() => setCreateModalOpen(true)}
          onDropFile={handlePdfFile}
        />
      ) : (
        <>
          <DocumentTable workspaceId={workspaceId} documents={documents} />

          <Pagination
            meta={meta}
            disabled={documentsQuery.isFetching}
            onPageChange={setPage}
          />
        </>
      )}

      <CreateDocumentModal
        open={createModalOpen}
        loading={createDocumentMutation.isPending}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateDocument}
      />

      {selectedFile && (uploadJob || localError) && (
        <UploadProgressCard
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          progress={localError ? 0 : uploadJob?.progress ?? 0}
          status={localError ? 'FAILED' : uploadJob?.status ?? 'FAILED'}
          loading={
            !localError &&
            uploadJob?.status !== 'COMPLETED' &&
            uploadJob?.status !== 'FAILED' &&
            uploadJob?.status !== 'CANCELLED'
          }
          error={
            localError ??
            (uploadJob?.status === 'FAILED'
              ? 'Upload failed. Please try again.'
              : null)
          }
          onCancel={handleCancel}
          onClose={handleCloseUploadCard}
          onView={handleViewUploadedDocument}
        />
      )}
    </div>
  )
}
