import type { SearchDocumentUserResult } from '../types/document.type'

type DisabledReason = SearchDocumentUserResult['disabledReason']

export function getDisabledReasonLabel(reason: DisabledReason) {
  if (!reason) return ''

  return {
    OWNER: 'Document owner',
    WORKSPACE_MEMBER: 'Already in workspace',
    ALREADY_HAS_DOCUMENT_PERMISSION: 'Already has access',
  }[reason]
}