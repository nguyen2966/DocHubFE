import type { Document } from "../../types/document.type";

interface DocumentRoleBadgeProps {
  document: Document
}

export function DocumentRoleBadge({ document }: DocumentRoleBadgeProps) {
  const permissions = document.permissions ?? []

  const label = permissions.includes('document:manage_access')
    ? 'Owner'
    : permissions.includes('document:edit')
      ? 'Editor'
      : permissions.includes('document:comment')
        ? 'Commenter'
        : 'Viewer'

  return (
    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
      {label}
    </span>
  )
}