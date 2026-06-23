import { useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

import { Header } from '../../shared/components/Header'
import { useSharedDocuments } from '../../features/documents/hooks/userSharedDocuments'
import { SharedDocumentTable } from '../../features/documents/components/shared-with-me/SharedDocumentTable'
import { SharedDocumentEmptyState } from '../../features/documents/components/shared-with-me/SharedDocumentEmptyState'
import { Pagination } from '../../shared/components/Pagination'

const SHARED_DOCUMENTS_PAGE_LIMIT = 8

export function SharedWithMePage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useSharedDocuments({ page, limit: SHARED_DOCUMENTS_PAGE_LIMIT })

  const documents = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="min-h-screen bg-white">
      <Header showFunctions />

      <main className="mx-auto max-w-6xl px-8 py-8">
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-700 transition hover:bg-stone-50 hover:text-stone-950"
            aria-label="Back to workspaces"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-2xl font-semibold text-stone-900">
            Shared with me
          </h1>

          <div className="h-6 w-px bg-stone-200" />

          <span className="text-sm text-stone-500">
            Total {meta?.totalItems ?? 0}
          </span>
        </div>

        {isLoading && (
          <div className="text-sm text-stone-500">
            Loading shared documents...
          </div>
        )}

        {isError && (
          <div className="text-sm text-red-500">
            Failed to load shared documents.
          </div>
        )}

        {!isLoading && !isError && documents.length === 0 && (
          <SharedDocumentEmptyState />
        )}

        {!isLoading && !isError && documents.length > 0 && (
          <>
            <SharedDocumentTable documents={documents} />

            <Pagination
              meta={meta}
              disabled={isFetching}
              onPageChange={setPage}
            />
          </>
        )}
      </main>
    </div>
  )
}
