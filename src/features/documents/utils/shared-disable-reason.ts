import type { SearchDocumentUserResult } from '../types/document.type'

type DisabledReason = SearchDocumentUserResult['disabledReason']

export function getDisabledReasonLabel(reason: DisabledReason) {
  if (!reason) return ''

  return {
    OWNER: 'Document owner',
    WORKSPACE_MEMBER: 'In Workspace',
    ALREADY_HAS_DOCUMENT_PERMISSION: 'Has access',
  }[reason]
}