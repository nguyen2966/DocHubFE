import {
  Buildings,
  FileText,
  Gear,
  PencilSimple,
  ShareNetwork,
  Trash,
  UserGear,
  UserMinus,
  UserPlus,
} from '@phosphor-icons/react'
import type { ActivityActionType } from '../types/activity.type'

interface ActivityActionIconProps {
  actionType: ActivityActionType
}

export function ActivityActionIcon({ actionType }: ActivityActionIconProps) {
  const IconComponent =
    actionType === 'create_document'
      ? FileText
      : actionType === 'update_document'
        ? PencilSimple
        : actionType === 'delete_document'
          ? Trash
          : actionType === 'share_document'
            ? ShareNetwork
            : actionType === 'revoke_access'
              ? UserMinus
              : actionType === 'invite_user'
                ? UserPlus
                : actionType === 'remove_user'
                  ? UserMinus
                  : actionType === 'change_user_role'
                    ? UserGear
                    : actionType === 'update_settings'
                      ? Gear
                      : actionType === 'workspace_creation'
                        ? Buildings
                        : FileText

  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-500">
      <IconComponent size={13} weight="regular" />
    </span>
  )
}