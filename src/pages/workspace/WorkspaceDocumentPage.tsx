import { useParams } from 'react-router-dom';
import { useDocuments } from '../../features/documents/hooks/useDocument';
import { DocumentHeader } from '../../features/documents/components/main-page/DocumentHeader';
import { DocumentEmptyState } from '../../features/documents/components/create-document/DocumentEmptyState';
import { DocumentTable } from '../../features/documents/components/main-page/DocumentTable';
import { useState } from 'react';
import { CreateDocumentModal } from '../../features/documents/components/create-document/CreateDocumentModal';
import { useCreateMarkdownDocument } from '../../features/documents/hooks/useCreateMarkdown';

export function WorkspaceDocumentsPage() {
  const { workspaceId } = useParams();
  const { data: documents = [], isLoading } = useDocuments(workspaceId);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const createDocumentMutation = useCreateMarkdownDocument(workspaceId!);

  const handleCreateDocument = (
    title: string,
    content: string,
  ) => {
    if (!workspaceId) return

    createDocumentMutation.mutate(
      {
        title,
        markdownContent: content,
        sourceType: 'md_editor',
      },
      {
        onSuccess: () => {
          setCreateModalOpen(false)
        },
      },
    )
  }


  if (isLoading) {
    return <div className="text-sm text-stone-500">Loading documents...</div>
  }

  return (
    <div className="w-full">
      <DocumentHeader
        total={documents.length}
        onUploadPdf={()=> setUploadModalOpen(true)}
        onCreateBlank={() => setCreateModalOpen(true)}
      />

      {documents.length === 0 ? (
        <DocumentEmptyState />
      ) : (
        <DocumentTable workspaceId={workspaceId} documents={documents} />
      )}

      <CreateDocumentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateDocument}
      />

      {/* 
      <UploadPdfModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      /> */}
    </div>

  )
}