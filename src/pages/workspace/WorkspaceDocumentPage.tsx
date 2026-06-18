import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { DocumentEmptyState } from '../../features/documents/components/create-document/DocumentEmptyState'
import { UploadProgressCard } from '../../features/documents/components/create-document/UploadProgressCard'
import { DocumentHeader } from '../../features/documents/components/main-page/DocumentHeader'
import { DocumentTable } from '../../features/documents/components/main-page/DocumentTable'
import { CreateDocumentModal } from '../../features/documents/components/create-document/CreateDocumentModal'
import { useCreateMarkdownDocument } from '../../features/documents/hooks/useCreateMarkdown'
import { useDocuments } from '../../features/documents/hooks/useDocument'
import { useUploadPdfWithProgress } from '../../features/documents/hooks/useUploadPdfWithProgress'
import { Pagination } from '../../shared/components/Pagination'

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

  const createDocumentMutation = useCreateMarkdownDocument(workspaceId!)
  const { upload: uploadPdfMutation, cancel: cancelUpload, job: uploadJob } =
    useUploadPdfWithProgress(workspaceId!)

  const openPdfFileSelector = () => {
    fileInputRef.current?.click()
  }

  const handleSelectedPdf = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || !workspaceId) return

    if (file.type !== 'application/pdf') {
      setLocalError('Only PDF files are supported.')
      return
    }

    if (file.size > 20 * 1024 * 1024) {
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

  const handleCancel = async () => {
    await cancelUpload()
    setSelectedFile(null)
    setLocalError(null)
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

  if (documentsQuery.isLoading) {
    return <div className="text-sm text-stone-500">Loading documents...</div>
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

      {localError && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-500 shadow-xl">
          {localError}
          <button
            className="ml-3 text-stone-400 hover:text-stone-600"
            onClick={() => setLocalError(null)}
          >
            x
          </button>
        </div>
      )}

      {uploadJob && selectedFile && (
        <UploadProgressCard
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          progress={uploadJob.progress}
          status={uploadJob.status}
          loading={
            uploadJob.status !== 'COMPLETED' &&
            uploadJob.status !== 'FAILED' &&
            uploadJob.status !== 'CANCELLED'
          }
          error={
            uploadJob.status === 'FAILED'
              ? 'Upload failed. Please try again.'
              : null
          }
          onCancel={handleCancel}
          onClose={() => {
            setSelectedFile(null)
            setLocalError(null)
          }}
          onView={handleViewUploadedDocument}
        />
      )}
    </div>
  )
}
