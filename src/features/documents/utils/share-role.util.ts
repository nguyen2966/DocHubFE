import type { ShareRole } from '../types/document.type'

export const SHARE_ROLES: ShareRole[] = ['viewer', 'commenter', 'editor']

export function getShareRoleLabel(role: ShareRole) {
  return {
    viewer: 'Viewer',
    commenter: 'Commenter',
    editor: 'Editor',
  }[role]
}

export function getShareRoleDescription(role: ShareRole) {
  return {
    viewer: 'Can view this document.',
    commenter: 'Can view and comment.',
    editor: 'Can view, comment, and edit.',
  }[role]
}