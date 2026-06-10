import type { Document, DocumentPermission } from '../types/document.type'

export const hasDocumentPermission = (
  document: Document | undefined,
  permission: DocumentPermission,
): boolean => {
  return Boolean(document?.permissions?.includes(permission))
}

export const canViewDocument = (document?: Document) =>
  hasDocumentPermission(document, 'document:view')

export const canEditDocument = (document?: Document) =>
  hasDocumentPermission(document, 'document:edit')

export const canRenameDocument = (document?: Document) =>
  hasDocumentPermission(document, 'document:rename')

export const canDeleteDocument = (document?: Document) =>
  hasDocumentPermission(document, 'document:delete')

export const canManageDocumentAccess = (document?: Document) =>
  hasDocumentPermission(document, 'document:manage_access')

export const canCommentDocument = (document?: Document) =>
  hasDocumentPermission(document, 'document:comment')