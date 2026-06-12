// import { useParams } from 'react-router-dom';
// import { useDocuments } from '../../features/documents/hooks/useDocument';
// import { DocumentHeader } from '../../features/documents/components/main-page/DocumentHeader';
// import { DocumentEmptyState } from '../../features/documents/components/create-document/DocumentEmptyState';
// import { DocumentTable } from '../../features/documents/components/main-page/DocumentTable';
// import { useState } from 'react';
// import { CreateDocumentModal } from '../../features/documents/components/create-document/CreateDocumentModal';
// import { useCreateMarkdownDocument } from '../../features/documents/hooks/useCreateMarkdown';
// import { useUploadPdfDocument } from '../../features/documents/hooks/useUploadPdfDocument';

// export function WorkspaceDocumentsPage() {
//   const { workspaceId } = useParams();
//   const { data: documents = [], isLoading } = useDocuments(workspaceId);

//   const [createModalOpen, setCreateModalOpen] = useState(false);
//   const [uploadModalOpen, setUploadModalOpen] = useState(false);

//   const createDocumentMutation = useCreateMarkdownDocument(workspaceId!);
//   const uploadPdfMutation = useUploadPdfDocument(workspaceId!)

//   const handleCreateDocument = (
//     title: string,
//     content: string,
//   ) => {
//     if (!workspaceId) return

//     createDocumentMutation.mutate(
//       {
//         title,
//         markdownContent: content,
//         sourceType: 'md_editor',
//       },
//       {
//         onSuccess: () => {
//           setCreateModalOpen(false)
//         },
//       },
//     )
//   }

//   const handleUploadPdf = (file: File, title?: string) => {
//     if (!workspaceId) return

//     uploadPdfMutation.mutate(
//       {
//         file,
//         title,
//       },
//       {
//         onSuccess: () => {
//           setUploadModalOpen(false)
//         },
//       },
//     )
//   }


//   if (isLoading) {
//     return <div className="text-sm text-stone-500">Loading documents...</div>
//   }

//   return (
//     <div className="w-full">
//       <DocumentHeader
//         total={documents.length}
//         onUploadPdf={() => setUploadModalOpen(true)}
//         onCreateBlank={() => setCreateModalOpen(true)}
//       />

//       {documents.length === 0 ? (
//         <DocumentEmptyState />
//       ) : (
//         <DocumentTable workspaceId={workspaceId} documents={documents} />
//       )}

//       <CreateDocumentModal
//         open={createModalOpen}
//         onClose={() => setCreateModalOpen(false)}
//         onCreate={handleCreateDocument}
//       />

//       {/* Bật sau khi code UploadPdfModal */}
//       {/* 
//       <UploadPdfModal
//         open={uploadModalOpen}
//         loading={uploadPdfMutation.isPending}
//         onClose={() => setUploadModalOpen(false)}
//         onUpload={handleUploadPdf}
//       /> 
//       */}
//     </div>

//   )
// }

import { useNavigate, useParams } from 'react-router-dom';
import { useDocuments } from '../../features/documents/hooks/useDocument';
import { DocumentHeader } from '../../features/documents/components/main-page/DocumentHeader';
import { DocumentEmptyState } from '../../features/documents/components/create-document/DocumentEmptyState';
import { DocumentTable } from '../../features/documents/components/main-page/DocumentTable';
import { useState, useRef } from 'react';
import { CreateDocumentModal } from '../../features/documents/components/create-document/CreateDocumentModal';
import { useCreateMarkdownDocument } from '../../features/documents/hooks/useCreateMarkdown';
import { useUploadPdfWithProgress } from '../../features/documents/hooks/useUploadPdfWithProgress';
import { UploadProgressCard } from '../../features/documents/components/create-document/UploadProgressCard';


export function WorkspaceDocumentsPage() {
  const { workspaceId } = useParams()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate();

  // Giữ riêng selectedFile chỉ để hiển thị tên/size trên card
  // Không dùng cho progress hay error — hook đảm nhiệm hết
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const { data: documents = [], isLoading } = useDocuments(workspaceId)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const createDocumentMutation = useCreateMarkdownDocument(workspaceId!)
  const { upload: uploadPdfMutation, cancel: cancelUpload, job: uploadJob } =
    useUploadPdfWithProgress(workspaceId!)

  // ── Handlers ───────────────────────────────────────────────────────────────

  const openPdfFileSelector = () => {
    fileInputRef.current?.click()
  }

  const handleSelectedPdf = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = '' // reset input để chọn lại cùng file vẫn trigger onChange

    if (!file || !workspaceId) return

    // Validate phía client trước khi gửi lên
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

  // ── Guards ─────────────────────────────────────────────────────────────────

  if (!workspaceId) {
    return <div className="text-sm text-red-500">Workspace ID is missing.</div>
  }

  if (isLoading) {
    return <div className="text-sm text-stone-500">Loading documents...</div>
  }

  // ── Render ─────────────────────────────────────────────────────────────────

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
        total={documents.length}
        onUploadPdf={openPdfFileSelector}
        onCreateBlank={() => setCreateModalOpen(true)}
      />

      {documents.length === 0 ? (
        <DocumentEmptyState
          onUploadPdf={openPdfFileSelector}
          onCreateBlank={() => setCreateModalOpen(true)}
        />
      ) : (
        <DocumentTable workspaceId={workspaceId} documents={documents} />
      )}

      <CreateDocumentModal
        open={createModalOpen}
        loading={createDocumentMutation.isPending}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateDocument}
      />

      {/* localError: lỗi validate trước khi upload (sai format, quá size) */}
      {localError && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-500 shadow-xl">
          {localError}
          <button
            className="ml-3 text-stone-400 hover:text-stone-600"
            onClick={() => setLocalError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* uploadJob: progress card — chỉ hiện khi đang có job chạy */}
      {uploadJob && selectedFile && (
        <UploadProgressCard
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          progress={uploadJob.progress}
          status={uploadJob.status}
          loading={uploadJob.status !== 'COMPLETED' && uploadJob.status !== 'FAILED' && uploadJob.status !== 'CANCELLED'}
          error={uploadJob.status === 'FAILED' ? 'Upload failed. Please try again.' : null}
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