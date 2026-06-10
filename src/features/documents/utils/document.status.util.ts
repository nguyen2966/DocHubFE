import type { DocumentProcessingStatus } from '../types/document.type'

export const getDocumentStatusLabel = (
  status: DocumentProcessingStatus,
): string => {
  switch (status) {
    case 'processing':
      return 'Processing'
    case 'processed':
      return 'Ready'
    case 'unprocessable':
      return 'Unprocessable'
    case 'failed':
      return 'Failed'
    default:
      return 'Unknown'
  }
}

export const isDocumentReady = (status: DocumentProcessingStatus): boolean => {
  return status === 'processed'
}

export const isDocumentProcessing = (
  status: DocumentProcessingStatus,
): boolean => {
  return status === 'processing'
}

export const isDocumentUnavailable = (
  status: DocumentProcessingStatus,
): boolean => {
  return status === 'failed' || status === 'unprocessable'
}