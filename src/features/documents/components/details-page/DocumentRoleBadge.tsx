import { Info } from '@phosphor-icons/react'
import type { Document } from '../../types/document.type'
import { Tooltips } from '../../../../shared/components/ui/Tooltips'

interface DocumentRoleBadgeProps {
  document: Document
}

type DocumentRoleBadgeValue = 'owner' | 'editor' | 'commenter' | 'viewer'

const ROLE_COPY: Record<
  DocumentRoleBadgeValue,
  { label: string; tooltip: string }
> = {
  owner: {
    label: 'Owner',
    tooltip: 'Full control (edit, share, comment, rename, delete)',
  },
  editor: {
    label: 'Editor',
    tooltip: 'Edit content and add comments',
  },
  commenter: {
    label: 'Commenter',
    tooltip: 'View and comment only',
  },
  viewer: {
    label: 'Viewer',
    tooltip: 'View only',
  },
}

export function DocumentRoleBadge({ document }: DocumentRoleBadgeProps) {
  const permissions = document.permissions ?? []

  const role: DocumentRoleBadgeValue =
    permissions.includes('document:manage_access')
      ? 'owner'
      : permissions.includes('document:edit')
        ? 'editor'
        : permissions.includes('document:comment')
          ? 'commenter'
          : 'viewer'

  const copy = ROLE_COPY[role]

  return (
    <Tooltips text={copy.tooltip} placement="bottom">
      <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-stone-100 px-3 text-xs font-medium text-stone-700">
        <span>{copy.label}</span>
        <Info size={13} className="text-stone-500" />
      </span>
    </Tooltips>
  )
}
